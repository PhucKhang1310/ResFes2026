import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import test from 'node:test';
import { chromium } from 'playwright';

const host = '127.0.0.1';
const port = 4173;
const appUrl = `http://${host}:${port}`;
const apiOrigin = 'https://api.src2026.test';

const delay = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

const startVite = async () => {
    const output = [];
    const processHandle = spawn(
        process.execPath,
        ['./node_modules/vite/bin/vite.js', '--host', host, '--port', String(port), '--strictPort'],
        {
            cwd: process.cwd(),
            env: {
                ...process.env,
                VITE_API_BASE_URL: `${apiOrigin}/api/v1`,
                VITE_TURNSTILE_SITE_KEY: 'release-browser-site-key',
            },
            stdio: ['ignore', 'pipe', 'pipe'],
        },
    );

    const onOutput = (chunk) => {
        output.push(String(chunk));
    };
    let spawnError = null;
    processHandle.stdout.on('data', onOutput);
    processHandle.stderr.on('data', onOutput);
    processHandle.once('error', (error) => {
        spawnError = error;
    });

    const deadline = Date.now() + 15_000;
    try {
        while (Date.now() < deadline) {
            if (spawnError) throw spawnError;
            if (processHandle.exitCode !== null) {
                throw new Error(`Vite exited with ${processHandle.exitCode}: ${output.join('')}`);
            }

            try {
                const response = await fetch(appUrl);
                if (response.ok) return { processHandle, output };
            } catch {
                // Vite has not started listening yet.
            }

            await delay(100);
        }

        throw new Error(`Vite did not become ready within 15 seconds: ${output.join('')}`);
    } catch (error) {
        if (!processHandle.killed) processHandle.kill('SIGTERM');
        throw error;
    }
};

const json = (route, body, status = 200) => route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
});

const waitForText = async (page, text) => {
    await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible' });
};

test('release browser flow covers public, authentication, admin, and submissions', { timeout: 120_000 }, async (t) => {
    const { processHandle } = await startVite();
    t.after(() => {
        if (!processHandle.killed) processHandle.kill('SIGTERM');
    });

    const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
    const browser = await chromium.launch({
        headless: true,
        ...(executablePath ? { executablePath } : {}),
    });
    t.after(() => browser.close());
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

    let authenticated = false;
    let adminMutation = false;
    let registrationDeadline = '2099-12-31T23:59:59+07:00';
    const sessionChecks = [];
    const submissions = new Set();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.route('https://challenges.cloudflare.com/turnstile/**', (route) => route.fulfill({
        contentType: 'application/javascript',
        body: `window.turnstile = {
            render: function (_container, options) {
                queueMicrotask(function () { options.callback('release-turnstile-token'); });
                return 'release-widget';
            },
            remove: function () {}
        };`,
    }));

    await page.route(`${apiOrigin}/**`, async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        const path = url.pathname.replace('/api/v1', '');
        const method = request.method();

        if (path === '/auth/me') {
            sessionChecks.push(authenticated);
            return authenticated
                ? json(route, { user: { id: 'admin-1', email: 'admin@example.com', role: 'super_admin' } })
                : json(route, { code: 'UNAUTHORIZED', message: 'Unauthorized' }, 401);
        }
        if (path === '/auth/login' && method === 'POST') {
            authenticated = true;
            return json(route, {
                message: 'Logged in',
                user: { id: 'admin-1', email: 'admin@example.com', role: 'super_admin' },
            });
        }
        if (path === '/content') {
            return json(route, {
                data: {
                    hero: {
                        registrationDeadline,
                    },
                },
            });
        }
        if (path === '/mentor' && method === 'GET') {
            return json(route, { data: [{
                _id: 'mentor-public-1',
                name: 'Release Mentor',
                fullName: 'Release Mentor',
                title: 'Dr.',
                role: 'Dr. | Software Engineering',
                department: 'Software Engineering',
                email: 'mentor@example.com',
                description: 'Release testing mentor',
                ResearchGate: 'https://orcid.org/0000-0002-1825-0097',
            }] });
        }
        if (path === '/publication/release-publication-1' && method === 'GET') {
            return json(route, { data: {
                _id: 'release-publication-1',
                publishTitle: 'Release publication detail',
                publishDate: '2026-09-01',
                author: 'Release Author',
                content: '<p>Cold publication detail loaded.</p>',
                imageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
            } });
        }
        if (path === '/news' && method === 'GET') {
            return json(route, { data: [{
                _id: 'release-news-1',
                title: 'Release news',
                author: 'Release Author',
                date: '2026-09-01',
                content: 'Release news content',
            }] });
        }
        if (path === '/mentor/admin' && method === 'GET') return json(route, { data: [] });
        if (path === '/mentor/admin' && method === 'POST') {
            adminMutation = true;
            return json(route, { data: { _id: 'mentor-admin-1', ...request.postDataJSON() } }, 201);
        }
        if (path === '/publication/submit' && method === 'POST') {
            submissions.add('publication');
            return json(route, { message: 'Publication submitted successfully', data: { _id: 'publication-1' } }, 201);
        }
        if (path === '/mentor/submit' && method === 'POST') {
            submissions.add('mentor');
            return json(route, { message: 'Mentor profile submitted successfully', data: { _id: 'mentor-1' } }, 201);
        }
        if (path === '/registration' && method === 'POST') {
            submissions.add('registration');
            return json(route, { message: 'Registration submitted successfully', registrationId: 'registration-1' }, 201);
        }

        return json(route, { data: [] });
    });

    await page.goto(appUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('summary').click();
    await page.getByRole('link', { name: 'Mentors' }).click();
    await page.waitForURL('**/mentors');
    await waitForText(page, 'Release Mentor');
    assert.equal(await page.getByRole('link', { name: 'Release Mentor ORCID' }).count(), 1);
    assert.equal(await page.getByRole('link', { name: 'Release Mentor ResearchGate' }).count(), 0);

    await page.goto(`${appUrl}/publications/release-publication-1`);
    await waitForText(page, 'Cold publication detail loaded.');
    assert.equal(await page.locator('header').count(), 1);
    assert.equal(await page.getByText('All rights reserved').count(), 1);
    assert.equal(await page.title(), 'Publication detail | SRC2026');

    await page.goto(`${appUrl}/news-list`);
    await page.getByRole('button', { name: 'Back' }).click();
    await page.waitForURL('**/#news');
    assert.equal(new URL(page.url()).hash, '#news');

    await page.goto(`${appUrl}/auth/login`);
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('release-password');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/admin');
    await page.reload();
    await page.waitForURL('**/admin');

    await page.goto(`${appUrl}/admin/mentors`);
    await page.getByRole('button', { name: 'Add mentor' }).click();
    await page.getByLabel('Title', { exact: true }).fill('Prof.');
    await page.getByLabel('Full name', { exact: true }).fill('Admin Created Mentor');
    await page.getByLabel('Email', { exact: true }).fill('created@example.com');
    await page.getByRole('button', { name: 'Create mentor' }).click();
    await waitForText(page, 'Mentor created.');

    await page.goto(`${appUrl}/submit/publication`);
    await page.getByLabel('Publish title').fill('Release Publication');
    await page.getByLabel('Author', { exact: true }).fill('Release Author');
    await page.getByLabel('Publish date').fill('2026-09-01');
    await page.getByLabel('Author Gmail').fill('author@example.com');
    await page.getByLabel('Content').fill('Release browser coverage');
    await page.getByRole('button', { name: 'Submit publication' }).click();
    await waitForText(page, 'Publication submission sent.');

    await page.goto(`${appUrl}/submit/mentor`);
    await page.getByLabel('Title', { exact: true }).fill('Dr.');
    await page.getByLabel('Full name', { exact: true }).fill('Submitted Mentor');
    await page.getByLabel('Email', { exact: true }).fill('submitted@example.com');
    await page.getByRole('button', { name: 'Submit mentor' }).click();
    await waitForText(page, 'Mentor profile submitted.');

    await page.goto(`${appUrl}/register`);
    await page.getByLabel('Name').fill('Release Attendee');
    await page.getByLabel('Email').fill('attendee@example.com');
    await page.getByLabel('Topic').fill('Release browser testing');
    await page.getByLabel('Field').selectOption({ index: 1 });
    await page.getByLabel('Mentor').selectOption({ label: 'Release Mentor' });
    await page.getByRole('button', { name: 'Submit Registration' }).click();
    await waitForText(page, 'Reference: registration-1');

    registrationDeadline = '2026-02-20T23:59:59+07:00';
    await page.evaluate(async () => {
        window.localStorage.clear();
        for (const cacheName of await window.caches.keys()) {
            await window.caches.delete(cacheName);
        }
    });
    await page.goto(appUrl);
    await waitForText(page, 'Registration is closed');
    assert.equal(await page.getByRole('link', { name: 'Register Now' }).count(), 0);
    await page.goto(`${appUrl}/register`);
    await waitForText(page, 'The SRC 2026 registration period ended on February 20, 2026.');
    assert.equal(await page.getByRole('button', { name: 'Submit Registration' }).count(), 0);

    assert.deepEqual(sessionChecks.includes(false), true, 'unauthenticated session check was not observed');
    assert.deepEqual(sessionChecks.includes(true), true, 'authenticated session check was not observed');
    assert.equal(adminMutation, true, 'admin mentor mutation was not observed');
    assert.deepEqual([...submissions].sort(), ['mentor', 'publication', 'registration']);
    assert.deepEqual(pageErrors, []);
});
