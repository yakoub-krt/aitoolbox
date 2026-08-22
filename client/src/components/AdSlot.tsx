import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID as string | undefined;

function getSlot(name: "home" | "article") {
  return name === "home"
    ? import.meta.env.VITE_ADSENSE_HOME_SLOT as string | undefined
    : import.meta.env.VITE_ADSENSE_ARTICLE_SLOT as string | undefined;
}

export function AdSenseLoader() {
  useEffect(() => {
    if (!publisherId || document.querySelector(`script[data-aitoolbox-adsense="${publisherId}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`;
    script.dataset.aitoolboxAdsense = publisherId;
    document.head.appendChild(script);
  }, []);
  return null;
}

export default function AdSlot({ placement }: { placement: "home" | "article" }) {
  const slot = getSlot(placement);
  const rendered = useRef(false);

  useEffect(() => {
    if (!publisherId || !slot || rendered.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      rendered.current = true;
    } catch {
      // لا تظهر رسالة للزائر إذا منع المتصفح الإعلانات أو لم يكن AdSense جاهزاً بعد.
    }
  }, [slot]);

  if (!publisherId || !slot) return null;
  return <aside className="mx-auto my-10 w-full max-w-4xl" aria-label="إعلان"><ins className="adsbygoogle block min-h-[110px] overflow-hidden rounded-2xl bg-white/[0.02]" style={{ display: "block" }} data-ad-client={publisherId} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" /></aside>;
}
