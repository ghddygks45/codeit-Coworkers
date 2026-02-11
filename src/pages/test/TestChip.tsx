import Chip from "../../components/common/Chip";

export default function TestChip() {
  return (
    <main className="bg-background-primary min-h-screen p-10">
      <h1 className="text-3xl-b text-background-inverse mb-8">
        Chip 컴포넌트 테스트
      </h1>

      {/* Large Size */}
      <section className="border-color-disabled bg-background-secondary mb-12 rounded-xl border p-6">
        <h2 className="text-2xl-sb text-color-primary mb-4">Large Size</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">
              default large
            </span>
            <Chip state="default" size="large" count={3}>
              법인 등기
            </Chip>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">hover large</span>
            <Chip state="hover" size="large" count={3}>
              법인 등기
            </Chip>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">
              pressed large
            </span>
            <Chip state="pressed" size="large" count={3}>
              법인 등기
            </Chip>
          </div>
        </div>
      </section>

      {/* Small Size */}
      <section className="border-color-disabled bg-background-secondary mb-12 rounded-xl border p-6">
        <h2 className="text-2xl-sb text-color-primary mb-4">Small Size</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">
              default small
            </span>
            <Chip state="default" size="small" count={3}>
              법인 등기
            </Chip>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">hover small</span>
            <Chip state="hover" size="small" count={3}>
              법인 등기
            </Chip>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">
              pressed small
            </span>
            <Chip state="pressed" size="small" count={3}>
              법인 등기
            </Chip>
          </div>
        </div>
      </section>

      {/* 모든 조합 */}
      <section className="border-color-disabled bg-background-secondary mb-12 rounded-xl border p-6">
        <h2 className="text-2xl-sb text-color-primary mb-4">모든 조합</h2>
        <div className="grid grid-cols-2 gap-8">
          {/* Large */}
          <div>
            <h3 className="text-lg-sb text-color-primary mb-3">Large</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Chip state="default" size="large" count={3}>
                  법인 등기
                </Chip>
                <span className="text-md-r text-color-secondary">default</span>
              </div>
              <div className="flex items-center gap-4">
                <Chip state="hover" size="large" count={3}>
                  법인 등기
                </Chip>
                <span className="text-md-r text-color-secondary">hover</span>
              </div>
              <div className="flex items-center gap-4">
                <Chip state="pressed" size="large" count={3}>
                  법인 등기
                </Chip>
                <span className="text-md-r text-color-secondary">pressed</span>
              </div>
            </div>
          </div>

          {/* Small */}
          <div>
            <h3 className="text-lg-sb text-color-primary mb-3">Small</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Chip state="default" size="small" count={3}>
                  법인 등기
                </Chip>
                <span className="text-md-r text-color-secondary">default</span>
              </div>
              <div className="flex items-center gap-4">
                <Chip state="hover" size="small" count={3}>
                  법인 등기
                </Chip>
                <span className="text-md-r text-color-secondary">hover</span>
              </div>
              <div className="flex items-center gap-4">
                <Chip state="pressed" size="small" count={3}>
                  법인 등기
                </Chip>
                <span className="text-md-r text-color-secondary">pressed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 실제 사용 예시 */}
      <section className="border-color-disabled bg-background-secondary rounded-xl border p-6">
        <h2 className="text-2xl-sb text-color-primary mb-4">실제 사용 예시</h2>
        <div className="bg-background-tertiary rounded-lg p-6">
          <h3 className="text-xl-sb text-color-primary mb-4">카테고리 필터</h3>
          <div className="flex flex-wrap gap-3">
            <Chip state="pressed" size="large" count={12}>
              법인 등기
            </Chip>
            <Chip state="default" size="large" count={8}>
              개인 등기
            </Chip>
            <Chip state="default" size="large" count={5}>
              부동산 등기
            </Chip>
            <Chip state="default" size="large" count={3}>
              기타
            </Chip>
          </div>
        </div>
      </section>
    </main>
  );
}
