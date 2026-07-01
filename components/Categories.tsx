import ImageSlot from "./ImageSlot";
import { ArrowRight, BITTER, IconCorner, IconSupplies } from "./icons";

function SectionHead({ over, title }: { over: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "#B97E1E", textTransform: "uppercase", marginBottom: 5 }}>
          {over}
        </div>
        <h2 className="t-h2" style={{ fontFamily: BITTER, fontWeight: 800, color: "#211C17", margin: 0 }}>{title}</h2>
      </div>
    </div>
  );
}

type CatImg = Record<string, { imageUrl: string | null; imagePos: string | null }>;

export default function Categories({ catImg = {} }: { catImg?: CatImg }) {
  return (
    <section id="cat" className="gx" style={{ paddingTop: 30, paddingBottom: 8, background: "#F1E9DB", scrollMarginTop: 64 }}>
      <SectionHead over="Каталог" title="Популярные категории" />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* крупный баннер */}
        <a href="/catalog/decor-brick" className="lift" style={{ position: "relative", display: "block", borderRadius: 18, overflow: "hidden", height: 158 }}>
          <ImageSlot src={catImg["decor-brick"]?.imageUrl} objectPosition={catImg["decor-brick"]?.imagePos} height={158} placeholder="Декоративный кирпич" alt="Декоративный кирпич" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(33,28,23,.78) 0%,rgba(33,28,23,.25) 55%,transparent 100%)" }} />
          <div style={{ position: "absolute", left: 16, bottom: 14, right: 14 }}>
            <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 19, color: "#FBF6EC" }}>Декоративный кирпич</div>
            <div style={{ fontSize: 12, color: "rgba(251,246,236,.78)", marginTop: 2 }}>Лофт, старый кирпич, античный · от 1 680 ₽/м²</div>
          </div>
          <div style={{ position: "absolute", top: 12, right: 12, width: 30, height: 30, borderRadius: "50%", background: "rgba(217,154,43,.95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowRight size={14} stroke="#211C17" width={2.4} />
          </div>
        </a>

        {/* ряд фото-категорий */}
        <div className="grid-2">
          <a href="/catalog/stone" className="lift" style={{ position: "relative", display: "block", borderRadius: 18, overflow: "hidden", height: 150 }}>
            <ImageSlot src={catImg["stone"]?.imageUrl} objectPosition={catImg["stone"]?.imagePos} height={150} placeholder="Камень / сланец" alt="Камень / сланец" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 40%,rgba(33,28,23,.82))" }} />
            <div style={{ position: "absolute", left: 13, bottom: 12, right: 10 }}>
              <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 15, color: "#FBF6EC" }}>Камень / сланец</div>
              <div style={{ fontSize: 11, color: "rgba(251,246,236,.75)", marginTop: 1 }}>Рваный, слоистый</div>
            </div>
          </a>
          <a href="/catalog/mosaic-3d" className="lift" style={{ position: "relative", display: "block", borderRadius: 18, overflow: "hidden", height: 150 }}>
            <ImageSlot src={catImg["mosaic-3d"]?.imageUrl} objectPosition={catImg["mosaic-3d"]?.imagePos} height={150} placeholder="3D-мозаика (соты)" alt="3D-мозаика, соты" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 40%,rgba(33,28,23,.82))" }} />
            <div style={{ position: "absolute", left: 13, bottom: 12, right: 10 }}>
              <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 15, color: "#FBF6EC" }}>3D-мозаика</div>
              <div style={{ fontSize: 11, color: "rgba(251,246,236,.75)", marginTop: 1 }}>Гексагон, соты</div>
            </div>
            <div style={{ position: "absolute", top: 11, left: 11, background: "#D99A2B", color: "#211C17", fontSize: 9.5, fontWeight: 800, letterSpacing: ".05em", padding: "4px 8px", borderRadius: 100, textTransform: "uppercase" }}>
              Хит
            </div>
          </a>
        </div>

        {/* ряд тёмных плиток */}
        <div className="grid-2">
          <a href="/catalog/corners" style={{ display: "flex", alignItems: "center", gap: 11, background: "#211C17", borderRadius: 16, padding: "14px 13px" }}>
            <div style={{ flex: "none", width: 38, height: 38, borderRadius: 10, background: "rgba(217,154,43,.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconCorner size={20} />
            </div>
            <div>
              <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 13.5, color: "#FBF6EC", lineHeight: 1.1 }}>Угловые элементы</div>
              <div style={{ fontSize: 10.5, color: "rgba(251,246,236,.6)", marginTop: 2 }}>Доборные</div>
            </div>
          </a>
          <a href="/catalog/supplies" style={{ display: "flex", alignItems: "center", gap: 11, background: "#211C17", borderRadius: 16, padding: "14px 13px" }}>
            <div style={{ flex: "none", width: 38, height: 38, borderRadius: 10, background: "rgba(217,154,43,.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconSupplies size={20} />
            </div>
            <div>
              <div style={{ fontFamily: BITTER, fontWeight: 700, fontSize: 13.5, color: "#FBF6EC", lineHeight: 1.1 }}>Расходники</div>
              <div style={{ fontSize: 10.5, color: "rgba(251,246,236,.6)", marginTop: 2 }}>Клей, затирка, лак</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
