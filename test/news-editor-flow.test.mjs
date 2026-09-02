import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import test from 'node:test';
import { chromium } from 'playwright';

const host = '127.0.0.1';
const port = 4174;
const appUrl = `http://${host}:${port}`;
const apiOrigin = 'https://api.news-flow.test';

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
                VITE_TURNSTILE_SITE_KEY: 'news-flow-browser-site-key',
            },
            stdio: ['ignore', 'pipe', 'pipe'],
        },
    );
    processHandle.stdout.on('data', (chunk) => output.push(String(chunk)));
    processHandle.stderr.on('data', (chunk) => output.push(String(chunk)));

    const deadline = Date.now() + 15_000;
    while (Date.now() < deadline) {
        if (processHandle.exitCode !== null) {
            throw new Error(`Vite exited with ${processHandle.exitCode}: ${output.join('')}`);
        }
        try {
            const response = await fetch(appUrl);
            if (response.ok) return processHandle;
        } catch {
            // Vite has not started listening yet.
        }
        await delay(100);
    }

    processHandle.kill('SIGTERM');
    throw new Error(`Vite did not become ready: ${output.join('')}`);
};

const json = (route, body, status = 200) => route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
});

const getMultipartField = (request, name) => {
    const contentType = request.headers()['content-type'] || '';
    const boundary = contentType.match(/boundary=([^;]+)/)?.[1];
    const body = request.postDataBuffer()?.toString('utf8') || '';
    if (!boundary) return '';

    const part = body
        .split(`--${boundary}`)
        .find((candidate) =>
            candidate.includes(`name="${name}"`) && !candidate.includes('filename='),
        );
    return part?.split('\r\n\r\n').slice(1).join('\r\n\r\n').replace(/\r\n$/, '') || '';
};

test('news composer preserves ordered content and every uploaded image', { timeout: 60_000 }, async (t) => {
    const processHandle = await startVite();
    t.after(() => {
        if (!processHandle.killed) processHandle.kill('SIGTERM');
    });

    const browser = await chromium.launch({ headless: true });
    t.after(() => browser.close());
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    let submittedContent = '';
    let submittedMultipart = '';

    await page.route(`${apiOrigin}/**`, async (route) => {
        const request = route.request();
        const path = new URL(request.url()).pathname.replace('/api/v1', '');

        if (path === '/auth/me') {
            return json(route, {
                user: { id: 'admin-1', email: 'admin@example.com', role: 'super_admin' },
            });
        }

        if (path === '/news' && request.method() === 'POST') {
            submittedContent = getMultipartField(request, 'content');
            submittedMultipart = request.postDataBuffer()?.toString('utf8') || '';
            return json(route, { message: 'Saved', data: { _id: 'news-flow-1' } }, 201);
        }

        if (path === '/news/news-flow-1') {
            return json(route, {
                data: {
                    _id: 'news-flow-1',
                    title: 'Ordered news flow',
                    author: 'News Editor',
                    date: '2026-09-02',
                    description: 'Flow summary',
                    content: submittedContent,
                    body: submittedContent,
                    images: [
                        'https://images.test/photo-a.png',
                        'https://images.test/photo-b.png',
                        'https://images.test/photo-c.png',
                    ],
                },
            });
        }

        if (path === '/news/admin') return json(route, { data: [] });
        return json(route, { data: [] });
    });

    await page.goto(`${appUrl}/admin/news/upload`);
    await page.getByLabel('Title', { exact: true }).fill('Ordered news flow');
    await page.getByLabel('Author').fill('News Editor');
    await page.locator('textarea[placeholder="Write this section of the article..."]').fill('Opening paragraph');

    const fileInput = page.locator('input[type="file"][multiple]');
    await fileInput.setInputFiles([
        { name: 'photo-a.png', mimeType: 'image/png', buffer: Buffer.from('photo-a') },
        { name: 'photo-b.png', mimeType: 'image/png', buffer: Buffer.from('photo-b') },
    ]);
    await page.getByRole('button', { name: 'Paragraph' }).click();
    await page.locator('textarea[placeholder="Write this section of the article..."]').nth(1).fill('Middle paragraph');
    await fileInput.setInputFiles([
        { name: 'photo-c.png', mimeType: 'image/png', buffer: Buffer.from('photo-c') },
    ]);

    const secondImageBlock = page.locator('article').filter({ hasText: 'photo-b.png' });
    await secondImageBlock.getByRole('button', { name: 'Move block down' }).click();
    await secondImageBlock.getByLabel('Alternative text').fill('Second event photo');
    await secondImageBlock.getByLabel('Caption / credit').fill('Photo B caption');

    assert.equal(await page.locator('article').filter({ hasText: 'Selected file:' }).count(), 3);
    await page.getByRole('button', { name: 'Submit news' }).click();
    await page.waitForURL('**/admin/news');

    assert.match(submittedContent, /^__RESFES_NEWS_BLOCKS_V1__/);
    for (const fileName of ['photo-a.png', 'photo-b.png', 'photo-c.png']) {
        assert.match(submittedMultipart, new RegExp(`filename="${fileName}"`));
    }

    await page.goto(`${appUrl}/news-list/news-flow-1`);
    await page.getByRole('heading', { name: 'Ordered news flow' }).waitFor();

    const renderedBlocks = await page.locator('[data-article-block]').evaluateAll((blocks) =>
        blocks.map((block) => ({
            type: block.getAttribute('data-article-block'),
            text: block.textContent?.trim() || '',
            src: block.querySelector('img')?.getAttribute('src') || '',
        })),
    );

    assert.deepEqual(renderedBlocks, [
        { type: 'paragraph', text: 'Opening paragraph', src: '' },
        { type: 'image', text: '', src: 'https://images.test/photo-a.png' },
        { type: 'paragraph', text: 'Middle paragraph', src: '' },
        { type: 'image', text: 'Photo B caption', src: 'https://images.test/photo-b.png' },
        { type: 'image', text: '', src: 'https://images.test/photo-c.png' },
    ]);
    assert.equal(await page.getByRole('img', { name: 'Second event photo' }).count(), 1);
    assert.deepEqual(pageErrors, []);
});
