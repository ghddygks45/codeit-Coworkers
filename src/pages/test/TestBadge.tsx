import Badge from "../../components/common/Badge/Badge";

export default function TestBadge() {
  return (
    <main className="bg-background-primary min-h-screen p-10">
      <h1 className="text-3xl-b text-background-inverse mb-8">
        Badge 컴포넌트 테스트
      </h1>

      {/* Small Size */}
      <section className="border-color-disabled bg-background-secondary mb-12 rounded-xl border p-6">
        <h2 className="text-2xl-sb text-color-primary mb-4">Small Size</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">done small</span>
            <Badge state="done" size="small" current={5} total={5} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">
              ongoing small
            </span>
            <Badge state="ongoing" size="small" current={3} total={5} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">start small</span>
            <Badge state="start" size="small" current={0} total={0} />
          </div>
        </div>
      </section>

      {/* Large Size */}
      <section className="border-border-primary bg-background-inverse mb-12 rounded-xl border p-6">
        <h2 className="text-2xl-sb text-color-primary mb-4">Large Size</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">
              ongoing large
            </span>
            <Badge state="ongoing" size="large" current={3} total={5} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">start large</span>
            <Badge state="start" size="large" current={0} total={0} />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-secondary">done large</span>
            <Badge state="done" size="large" current={5} total={5} />
          </div>
        </div>
      </section>

      {/* 모든 조합 */}
      <section className="border-color-disabled bg-background-secondary mb-12 rounded-xl border p-6">
        <h2 className="text-2xl-sb text-color-primary mb-4">
          All Combinations
        </h2>
        <div className="grid grid-cols-2 gap-8">
          {/* Small */}
          <div>
            <h3 className="text-lg-sb text-color-primary mb-3">Small</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Badge state="done" size="small" current={5} total={5} />
                <span className="text-md-r text-color-secondary">done 5/5</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge state="ongoing" size="small" current={3} total={5} />
                <span className="text-md-r text-color-secondary">
                  ongoing 3/5
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge state="start" size="small" current={0} total={0} />
                <span className="text-md-r text-color-secondary">
                  start 0/0
                </span>
              </div>
            </div>
          </div>

          {/* Large */}
          <div>
            <h3 className="text-lg-sb text-color-primary mb-3">Large</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Badge state="done" size="large" current={5} total={5} />
                <span className="text-md-r text-color-secondary">done 5/5</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge state="ongoing" size="large" current={3} total={5} />
                <span className="text-md-r text-color-secondary">
                  ongoing 3/5
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Badge state="start" size="large" current={0} total={0} />
                <span className="text-md-r text-color-secondary">
                  start 0/0
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 실제 사용 예시 */}
      <section className="border-color-disabled bg-background-secondary rounded-xl border p-6">
        <h2 className="text-2xl-sb text-color-primary mb-4">실제 사용 예시</h2>
        <div className="bg-background-tertiary rounded-lg p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl-sb text-color-primary">할 일 목록</h3>
            <Badge state="ongoing" size="small" current={3} total={5} />
          </div>
          <ul className="text-md-r text-color-secondary space-y-2">
            <li>✅ 디자인 시스템 구축</li>
            <li>✅ Badge 컴포넌트 개발</li>
            <li>✅ Chip 컴포넌트 개발</li>
            <li>⏳ Button 컴포넌트 개발</li>
            <li>⏳ Input 컴포넌트 개발</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
