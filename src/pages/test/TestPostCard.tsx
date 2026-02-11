import PostCard from "../../features/boards/components/PostCard";

const sampleData = {
  title: "커피 머신 고장 신고합니다 ☕🧨",
  content:
    "오늘 아침 출근과 동시에 알게 된 사실...\n1층 커피 머신에서 물만 나옵니다. (커피는 실종 😭)...",
  author: "우지은",
  date: "2024. 07. 25",
  likeCount: 999,
  imageUrl: "/src/features/boards/assets/coffee-machine.png",
};

export default function TestPostCard() {
  return (
    <main className="bg-background-primary min-h-screen p-10">
      <h1 className="text-3xl-b text-background-inverse mb-8">
        PostCard 컴포넌트 테스트
      </h1>

      {/* Best Large */}
      <section className="mb-12">
        <h2 className="text-2xl-sb text-background-inverse mb-4">Best Large</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-disabled">
              hasImage: true
            </span>
            <PostCard
              state="best"
              size="large"
              hasImage={true}
              {...sampleData}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-disabled">
              hasImage: false
            </span>
            <PostCard
              state="best"
              size="large"
              hasImage={false}
              {...sampleData}
            />
          </div>
        </div>
      </section>

      {/* Best Small */}
      <section className="mb-12">
        <h2 className="text-2xl-sb text-background-inverse mb-4">Best Small</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-disabled">
              hasImage: true
            </span>
            <PostCard
              state="best"
              size="small"
              hasImage={true}
              {...sampleData}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-disabled">
              hasImage: false
            </span>
            <PostCard
              state="best"
              size="small"
              hasImage={false}
              {...sampleData}
            />
          </div>
        </div>
      </section>

      {/* Default Large */}
      <section className="mb-12">
        <h2 className="text-2xl-sb text-background-inverse mb-4">
          Default Large
        </h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-disabled">
              hasImage: true
            </span>
            <PostCard
              state="default"
              size="large"
              hasImage={true}
              {...sampleData}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-disabled">
              hasImage: false
            </span>
            <PostCard
              state="default"
              size="large"
              hasImage={false}
              {...sampleData}
            />
          </div>
        </div>
      </section>

      {/* Default Small */}
      <section className="mb-12">
        <h2 className="text-2xl-sb text-background-inverse mb-4">
          Default Small
        </h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-disabled">
              hasImage: true
            </span>
            <PostCard
              state="default"
              size="small"
              hasImage={true}
              {...sampleData}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm-m text-color-disabled">
              hasImage: false
            </span>
            <PostCard
              state="default"
              size="small"
              hasImage={false}
              {...sampleData}
            />
          </div>
        </div>
      </section>

      {/* 모든 조합 한눈에 */}
      <section className="mb-12">
        <h2 className="text-2xl-sb text-background-inverse mb-4">
          모든 조합 비교
        </h2>
        <div className="bg-background-secondary rounded-xl p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Best */}
            <div>
              <h3 className="text-lg-sb text-color-primary mb-4">Best</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-xs-m text-color-secondary mb-2 block">
                    Large + Image
                  </span>
                  <PostCard
                    state="best"
                    size="large"
                    hasImage={true}
                    {...sampleData}
                  />
                </div>
                <div>
                  <span className="text-xs-m text-color-secondary mb-2 block">
                    Small + Image
                  </span>
                  <PostCard
                    state="best"
                    size="small"
                    hasImage={true}
                    {...sampleData}
                  />
                </div>
              </div>
            </div>

            {/* Default */}
            <div>
              <h3 className="text-lg-sb text-color-primary mb-4">Default</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-xs-m text-color-secondary mb-2 block">
                    Large + Image
                  </span>
                  <PostCard
                    state="default"
                    size="large"
                    hasImage={true}
                    {...sampleData}
                  />
                </div>
                <div>
                  <span className="text-xs-m text-color-secondary mb-2 block">
                    Small + Image
                  </span>
                  <PostCard
                    state="default"
                    size="small"
                    hasImage={true}
                    {...sampleData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 이미지 없는 버전 비교 */}
      <section>
        <h2 className="text-2xl-sb text-background-inverse mb-4">
          이미지 없는 버전 (hasImage: false)
        </h2>
        <div className="bg-background-secondary rounded-xl p-6">
          <div className="flex flex-wrap gap-6">
            <PostCard
              state="best"
              size="large"
              hasImage={false}
              {...sampleData}
            />
            <PostCard
              state="best"
              size="small"
              hasImage={false}
              {...sampleData}
            />
            <PostCard
              state="default"
              size="large"
              hasImage={false}
              {...sampleData}
            />
            <PostCard
              state="default"
              size="small"
              hasImage={false}
              {...sampleData}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
