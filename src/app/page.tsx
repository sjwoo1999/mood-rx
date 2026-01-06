import Link from 'next/link';
import { Pill, ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';
import MockModeBanner from '@/components/mock/MockModeBanner';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Mock Mode Banner */}
      <MockModeBanner variant="full" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="max-w-2xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
              <Sparkles className="w-4 h-4 text-brand-accent" />
              <span className="text-sm font-medium text-gray-600">AI 기반 감정 정리 도우미</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              감정을 정리하고<br />
              <span className="text-brand-primary">24시간 안에 실행할</span><br />
              한 가지를 처방받으세요
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              복잡한 감정을 정리하고, 오늘 당장 할 수 있는
              구체적인 행동 하나를 AI가 제안해드립니다.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/rx/new"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white 
                         font-semibold rounded-xl shadow-lg shadow-blue-500/25
                         hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30
                         active:scale-[0.98] transition-all"
              >
                <Pill className="w-5 h-5" />
                <span>처방전 받기</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-50" />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            어떻게 도움이 되나요?
          </h2>

          <div className="grid gap-6">
            {/* Feature 1 */}
            <div className="flex gap-4 p-5 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-blue-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">감정의 핵심 원인 파악</h3>
                <p className="text-sm text-gray-600">
                  복잡하게 얽힌 감정을 정리하고, 지금 느끼는 감정의 핵심 원인을 한 문장으로 정리해드려요.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 p-5 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-teal-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-brand-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">24시간 안에 할 행동</h3>
                <p className="text-sm text-gray-600">
                  추상적인 조언 대신, 시간/장소/횟수가 구체적인 행동 하나를 제안해드려요.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 p-5 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-amber-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">안전한 경험</h3>
                <p className="text-sm text-gray-600">
                  위기 상황이 감지되면 전문 기관 안내를 드려요. 이 서비스는 의료 서비스가 아닙니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            사용 방법
          </h2>

          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
            {[
              { step: '1', title: '상황 입력', desc: '지금 겪고 있는 상황을 자유롭게 작성' },
              { step: '2', title: '감정 선택', desc: '현재 느끼는 주된 감정과 에너지 레벨 선택' },
              { step: '3', title: '처방 받기', desc: 'AI가 분석한 결과와 행동 제안 확인' },
            ].map((item) => (
              <div key={item.step} className="flex-1 text-center">
                <div className="w-10 h-10 rounded-full bg-brand-primary text-white font-bold 
                              flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/rx/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white 
                       font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              <span>지금 시작하기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
