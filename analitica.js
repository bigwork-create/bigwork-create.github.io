/* Hubert Apps — Google Analytics (Firebase)
   Este archivo NO se carga solo: lo carga consentimiento.js únicamente cuando
   el visitante pulsa "Aceptar" en el aviso de cookies. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUEKEimBQRCznM8Vgw8jeGgkgZdhcaFB0",
  authDomain: "hubert-app-001.firebaseapp.com",
  projectId: "hubert-app-001",
  storageBucket: "hubert-app-001.firebasestorage.app",
  messagingSenderId: "645938730565",
  appId: "1:645938730565:web:c77e9afd5029738a52f52c",
  measurementId: "G-YQT7FG748M"
};

function hayConsentimiento() {
  try { return localStorage.getItem("consentimiento_analitica") === "aceptado"; } catch (e) { return false; }
}

if (hayConsentimiento()) {
  try {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    // Cuenta cada clic en un botón de descarga (evento "descarga_app")
    document.addEventListener("click", function (e) {
      if (!hayConsentimiento()) return; // por si retiró el consentimiento sin recargar
      const a = e.target.closest && e.target.closest("a[download], a[href$='.apk'], a[href$='.exe']");
      if (!a) return;
      const archivo = (a.getAttribute("href") || "").split("/").pop();
      logEvent(analytics, "descarga_app", { archivo: archivo });
    });
  } catch (err) {
    console.warn("Analytics no disponible:", err);
  }
}
