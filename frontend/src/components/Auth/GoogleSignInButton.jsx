import React, { useEffect, useRef } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google script load failed")));
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google script load failed"));
    document.head.appendChild(script);
  });

function GoogleSignInButton({
  clientId,
  onSuccess,
  onError,
  text = "continue_with",
  width = 340,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!clientId) {
        onError?.("Google Sign-In is not configured.");
        return;
      }

      try {
        await loadGoogleScript();

        if (!mounted || !window.google?.accounts?.id || !containerRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential) {
              onSuccess?.(response.credential);
            } else {
              onError?.("Google sign-in failed.");
            }
          },
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text,
          width,
        });
      } catch (error) {
        onError?.("Unable to load Google sign-in.");
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [clientId, onError, onSuccess, text, width]);

  return <div ref={containerRef} />;
}

export default GoogleSignInButton;
