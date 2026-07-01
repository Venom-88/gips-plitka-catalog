import ImageSlot from "./ImageSlot";
import { ArrowRight, BITTER, HexFilled } from "./icons";

export default function Hero({ imageUrl, imagePos }: { imageUrl?: string | null; imagePos?: string | null }) {
  return (
    <section className="hero">
      <div style={{ position: "absolute", inset: 0 }}>
        <ImageSlot
          src={imageUrl}
          height="100%"
          priority
          placeholder="Фото интерьера с плиткой студии"
          alt="Интерьер с авторской гипсовой плиткой студии «Гипс Стиль 31»"
          style={{ height: "100%" }}
          objectPosition={imagePos}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg,rgba(33,28,23,.30) 0%,rgba(33,28,23,.05) 38%,rgba(33,28,23,.62) 74%,rgba(33,28,23,.92) 100%)",
        }}
      />
      <div className="gx" style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingTop: 0, paddingBottom: 40 }}>
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(217,154,43,.95)",
              color: "#211C17",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: ".06em",
              padding: "6px 12px",
              borderRadius: 100,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            <HexFilled size={12} fill="#211C17" /> Ручная работа · малые партии
          </div>
          <h1
            className="t-h1"
            style={{ fontFamily: BITTER, fontWeight: 800, color: "#FBF6EC", margin: "0 0 14px", letterSpacing: "-.01em", textWrap: "balance" }}
          >
            Авторская гипсовая плитка ручной&nbsp;работы
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: "rgba(251,246,236,.86)", margin: "0 0 22px", maxWidth: 440 }}>
            Эксклюзивные фактуры, индивидуальный подбор цвета под ваш интерьер и экологичный гипс. Делаем под заказ — даже
            нестандартные размеры.
          </p>
          <div className="hero-cta">
            <a
              href="#cat"
              className="press-98 lift"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#D99A2B",
                color: "#211C17",
                fontWeight: 700,
                fontSize: 15,
                padding: "15px 24px",
                borderRadius: 14,
                boxShadow: "0 8px 20px -6px rgba(217,154,43,.7)",
              }}
            >
              Смотреть каталог
              <ArrowRight size={17} stroke="#211C17" width={2.2} />
            </a>
            <a
              href="#form"
              className="press-98"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "rgba(251,246,236,.12)",
                border: "1px solid rgba(251,246,236,.35)",
                color: "#FBF6EC",
                fontWeight: 600,
                fontSize: 15,
                padding: "15px 24px",
                borderRadius: 14,
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            >
              Заказать консультацию
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
