// Safety response templates

export const SAFETY_MESSAGE = {
    title: '긴급한 안전 안내',
    body: '지금은 처방을 생성하지 않습니다. 즉시 주변의 도움을 요청하거나, 지역의 긴급 도움 서비스를 이용하세요.',
    next_step: '가까운 사람에게 연락하거나, 긴급 지원 기관에 연결해보세요.',
} as const;

export const DISCLAIMER = {
    title: '안내사항',
    body: '이 서비스는 의료 서비스가 아닙니다. 전문적인 상담이나 치료가 필요한 경우 의료 전문가와 상담하세요.',
} as const;
