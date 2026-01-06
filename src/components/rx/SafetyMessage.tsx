import { AlertTriangle, Phone, Heart } from 'lucide-react';

export interface SafetyMessageProps {
    title: string;
    body: string;
    next_step: string;
}

export default function SafetyMessage({ title, body, next_step }: SafetyMessageProps) {
    return (
        <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 bg-amber-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-bold text-amber-900 text-lg">{title}</h2>
            </div>

            {/* Content */}
            <div className="px-5 py-5 space-y-4">
                <p className="text-amber-900 leading-relaxed">
                    {body}
                </p>

                <div className="p-4 bg-white rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
                        <Heart className="w-4 h-4" />
                        <span>다음 단계</span>
                    </div>
                    <p className="text-gray-700">
                        {next_step}
                    </p>
                </div>

                {/* Emergency Resources */}
                <div className="pt-4 border-t border-amber-200">
                    <p className="text-sm text-amber-800 font-medium mb-3">
                        도움을 요청할 수 있는 곳
                    </p>
                    <div className="space-y-2">
                        <a
                            href="tel:109"
                            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-200
                         hover:bg-amber-50 transition-colors"
                        >
                            <Phone className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="font-medium text-gray-900">자살예방상담전화</p>
                                <p className="text-sm text-gray-600">109 (24시간)</p>
                            </div>
                        </a>
                        <a
                            href="tel:1577-0199"
                            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-200
                         hover:bg-amber-50 transition-colors"
                        >
                            <Phone className="w-5 h-5 text-amber-600" />
                            <div>
                                <p className="font-medium text-gray-900">정신건강위기상담전화</p>
                                <p className="text-sm text-gray-600">1577-0199 (24시간)</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
