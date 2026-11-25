import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container container-narrow page">
      <div className="card empty">
        <h1>Page not found</h1>
        <p className="muted">पेज नहीं मिला</p>
        <Link href="/" className="btn btn-primary">
          Go to home
        </Link>
      </div>
    </div>
  );
}
