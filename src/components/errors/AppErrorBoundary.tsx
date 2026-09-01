import { Component, type ErrorInfo, type PropsWithChildren } from "react";

type State = {
  hasError: boolean;
  supportId: string;
};

const createSupportId = () =>
  typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `ui-${Date.now().toString(36)}`;

class AppErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false, supportId: "" };

  static getDerivedStateFromError(): State {
    return { hasError: true, supportId: createSupportId() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ui.render_failed", {
      supportId: this.state.supportId,
      errorName: error.name,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-neutral-950 p-6 text-white">
        <section className="max-w-lg text-center" role="alert">
          <h1 className="text-2xl font-semibold">This page could not be displayed</h1>
          <p className="mt-3 text-neutral-300">Reload the page or return to the homepage.</p>
          <p className="mt-2 text-sm text-neutral-400">Support ID: {this.state.supportId}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button className="btn" type="button" onClick={() => window.location.reload()}>Reload</button>
            <a className="btn btn-outline" href="/">Homepage</a>
          </div>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;
