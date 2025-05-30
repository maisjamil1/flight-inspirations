export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex h-14 items-center justify-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Flight Inspirations. All rights reserved.</p>
      </div>
    </footer>
  );
}
