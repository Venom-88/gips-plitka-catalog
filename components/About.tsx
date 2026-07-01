import ImageSlot from "./ImageSlot";
import { BITTER } from "./icons";

export default function About({ imageUrl, imagePos }: { imageUrl?: string | null; imagePos?: string | null }) {
  return (
    <section className="gx" style={{ paddingTop: 32, paddingBottom: 12, background: "#F1E9DB" }}>
      <div className="about-grid">
        <div className="about-media">
          <ImageSlot src={imageUrl} height="100%" placeholder="Фото мастера / мастерской" alt="Мастер студии «Гипс Стиль 31» за работой" style={{ height: "100%" }} objectPosition={imagePos} />
          <div
            style={{
              position: "absolute",
              left: 14,
              bottom: 14,
              background: "rgba(241,233,219,.95)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              padding: "8px 13px",
              borderRadius: 100,
              fontSize: 11.5,
              fontWeight: 600,
              color: "#211C17",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4A6B36" }} />
            Мастерская в Губкине
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#B97E1E", textTransform: "uppercase", marginBottom: 6 }}>
            О студии
          </div>
          <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#211C17", margin: "0 0 11px" }}>
            Небольшая студия, где каждую плитку держат в руках
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#5C5040", margin: "0 0 14px" }}>
            Мы не завод — и в этом наша сила. Заливаем малыми партиями, вручную тонируем и контролируем каждую плитку.
            Поэтому можем подобрать цвет точно под ваш интерьер и сделать нестандартный размер, который не найти в крупных
            магазинах.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1, background: "#FBF6EC", border: "1px solid rgba(33,28,23,.08)", borderRadius: 14, padding: "13px 14px" }}>
              <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 22, color: "#B5552F" }}>6 лет</div>
              <div style={{ fontSize: 11, color: "#6F6253", marginTop: 2 }}>ручного производства</div>
            </div>
            <div style={{ flex: 1, background: "#FBF6EC", border: "1px solid rgba(33,28,23,.08)", borderRadius: 14, padding: "13px 14px" }}>
              <div style={{ fontFamily: BITTER, fontWeight: 800, fontSize: 22, color: "#B5552F" }}>400+</div>
              <div style={{ fontSize: 11, color: "#6F6253", marginTop: 2 }}>интерьеров с плиткой</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
