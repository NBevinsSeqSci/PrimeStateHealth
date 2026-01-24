import { useEffect, useRef } from "react";

const loadScript = (() => {
  let promise: Promise<void> | null = null;
  return () => {
    if (typeof window === "undefined") return Promise.reject(new Error("Window unavailable"));
    if ((window as any).SmilesDrawer) return Promise.resolve();
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/smiles-drawer@2.0.2/dist/smiles-drawer.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load SmilesDrawer"));
        document.body.appendChild(script);
      });
    }
    return promise;
  };
})();

interface MoleculeRendererProps {
  smiles?: string;
  size?: "sm" | "md";
}

export function MoleculeRenderer({ smiles, size = "md" }: MoleculeRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let disposed = false;
    if (!smiles || typeof window === "undefined") return undefined;

    loadScript()
      .then(() => {
        if (disposed || !containerRef.current) return;
        const SmilesDrawer = (window as any).SmilesDrawer;
        const width = size === "sm" ? 180 : 220;
        const height = size === "sm" ? 140 : 180;
        containerRef.current.innerHTML = "";
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        containerRef.current.appendChild(canvas);
        SmilesDrawer.parse(
          smiles,
          (tree: any) => {
            if (disposed) return;
            const drawer = new SmilesDrawer.Drawer({ width, height });
            drawer.draw(tree, canvas, "light");
          },
          () => {
            if (disposed || !containerRef.current) return;
            containerRef.current.innerHTML = "Structure preview unavailable";
          },
        );
      })
      .catch(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = "Structure preview unavailable";
      });

    return () => {
      disposed = true;
    };
  }, [smiles, size]);

  if (!smiles) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
        —
      </div>
    );
  }

  return <div ref={containerRef} className="h-44 w-full" />;
}
