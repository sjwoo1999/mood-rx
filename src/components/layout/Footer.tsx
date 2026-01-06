import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="text-xs text-gray-500 max-w-md">
                        <p className="font-medium text-gray-600 mb-1">안내사항</p>
                        <p>
                            이 서비스는 의료 서비스가 아닙니다. 전문적인 상담이나 치료가 필요한 경우
                            의료 전문가와 상담하세요.
                        </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                        <span>for emotional wellness</span>
                    </div>

                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Mood Rx. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
