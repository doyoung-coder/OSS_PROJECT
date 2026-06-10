// src/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// 💡 1. 4개 국어 통합 사전
const DIC = {
    ko: {
        noNotice: "최신 공지사항이 없습니다.",
        searchTitle: "🔍 검색",
        searchBtn: "검색",
        writeBtn: "✏️ 리뷰 작성 (+100P)",
        myExchange: "내 환전 신청 내역",
        noExchange: "환전 신청 내역이 없습니다.",
        amount: "신청 금액:",
        reqDate: "신청 일시:",
        appDate: "승인 일시:",
        rejDate: "거절 일시:",
        status: "상태:",
        pending: "대기 중",
        approved: "승인 완료",
        rejected: "거절됨",
        reason: "* 사유:",
        anonymous: "익명 사용자",
        totalReviews: "📝 누적 리뷰:",
        rareTags: "#잘알려지지 않은 #희귀한",
        detailBtn: "상세보기 및 댓글",
        prevBtn: "◀ 이전",
        nextBtn: "다음 ▶",
        logout: "로그아웃",
        logoutAlert: "로그아웃 되었습니다.",
        countUnit: "개",
        loginSubtitle: "현지인이 추천하는 숨은 명소 찾기",
        emailPlaceholder: "이메일(아이디)",
        pwPlaceholder: "비밀번호",
        loginBtn: "로그인",
        orText: "또는",
        guestBtn: "비회원으로 둘러보기",
        noAccount: "계정이 없으신가요? ",
        signupLink: "회원가입",
        backBtn: "← 뒤로가기",
        loginAlertEmpty: "아이디와 비밀번호를 모두 입력해주세요.",
        loginAlertAdmin: "관리자 계정으로 접속합니다.",
        loginAlertWelcome: "님 환영합니다!",
        loginAlertFail: "로그인 실패: 이메일 또는 비밀번호를 확인해주세요.",
        loginAlertNetwork: "서버와 통신할 수 없습니다.",
        user: "사용자"
    },
    ja: {
        noNotice: "最新のお知らせはありません。",
        searchTitle: "🔍 検索",
        searchBtn: "検索",
        writeBtn: "✏️ レビュー作成 (+100P)",
        myExchange: "私の換金申請履歴",
        noExchange: "換金申請履歴がありません。",
        amount: "申請金額:",
        reqDate: "申請日時:",
        appDate: "承認日時:",
        rejDate: "拒否日時:",
        status: "状態:",
        pending: "待機中",
        approved: "承認完了",
        rejected: "拒否されました",
        reason: "* 理由:",
        anonymous: "匿名ユーザー",
        totalReviews: "📝 累積レビュー:",
        rareTags: "#あまり知られていない #レア",
        detailBtn: "詳細表示とコメント",
        prevBtn: "◀ 以前",
        nextBtn: "次へ ▶",
        logout: "ログアウト",
        logoutAlert: "ログアウトしました。",
        countUnit: "件",
        loginSubtitle: "地元民がお勧めする隠れた名所探し",
        emailPlaceholder: "メールアドレス(ID)",
        pwPlaceholder: "パスワード",
        loginBtn: "ログイン",
        orText: "または",
        guestBtn: "ゲストとして閲覧",
        noAccount: "アカウントをお持ちでないですか？ ",
        signupLink: "会員登録",
        backBtn: "← 戻る",
        loginAlertEmpty: "IDとパスワードを両方入力してください。",
        loginAlertAdmin: "管理者アカウントで接続します。",
        loginAlertWelcome: "様、ようこそ！",
        loginAlertFail: "ログイン失敗：メールアドレスまたはパスワードを確認してください。",
        loginAlertNetwork: "サーバーと通信できません。",
        user: "ユーザー"
    },
    en: {
        noNotice: "No new notices.",
        searchTitle: "🔍 Search",
        searchBtn: "Search",
        writeBtn: "✏️ Write Review (+100P)",
        myExchange: "My Exchange Requests",
        noExchange: "No exchange requests found.",
        amount: "Amount:",
        reqDate: "Request Date:",
        appDate: "Approval Date:",
        rejDate: "Rejection Date:",
        status: "Status:",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        reason: "* Reason:",
        anonymous: "Anonymous User",
        totalReviews: "📝 Total Reviews:",
        rareTags: "#Unknown #Rare",
        detailBtn: "Details & Comments",
        prevBtn: "◀ Prev",
        nextBtn: "Next ▶",
        logout: "Logout",
        logoutAlert: "Logged out successfully.",
        countUnit: "",
        loginSubtitle: "Find hidden gems recommended by locals",
        emailPlaceholder: "Email (ID)",
        pwPlaceholder: "Password",
        loginBtn: "Login",
        orText: "Or",
        guestBtn: "Continue as Guest",
        noAccount: "Don't have an account? ",
        signupLink: "Sign Up",
        backBtn: "← Go Back",
        loginAlertEmpty: "Please enter both your email and password.",
        loginAlertAdmin: "Logging in as Administrator.",
        loginAlertWelcome: ", welcome!", // 이름 뒤에 붙어 "John, welcome!" 형태로 출력됩니다.
        loginAlertFail: "Login failed: Please check your email or password.",
        loginAlertNetwork: "Cannot communicate with the server.",
        user: "User"
    },
    zh: {
        noNotice: "没有最新公告。",
        searchTitle: "🔍 搜索",
        searchBtn: "搜索",
        writeBtn: "✏️ 写评论 (+100P)",
        myExchange: "我的兑换申请",
        noExchange: "没有兑换申请记录。",
        amount: "申请金额:",
        reqDate: "申请日期:",
        appDate: "批准日期:",
        rejDate: "拒绝日期:",
        status: "状态:",
        pending: "待处理",
        approved: "已批准",
        rejected: "已拒绝",
        reason: "* 原因:",
        anonymous: "匿名用户",
        totalReviews: "📝 累计评论:",
        rareTags: "#鲜为人知 #稀有",
        detailBtn: "详情与评论",
        prevBtn: "◀ 上一页",
        nextBtn: "下一页 ▶",
        logout: "登出",
        logoutAlert: "已成功登出。",
        countUnit: "个",
        loginSubtitle: "发现当地人推荐的隐藏景点",
        emailPlaceholder: "电子邮件 (账号)",
        pwPlaceholder: "密码",
        loginBtn: "登录",
        orText: "或",
        guestBtn: "以游客身份浏览",
        noAccount: "还没有账号？ ",
        signupLink: "注册",
        backBtn: "← 返回",
        loginAlertEmpty: "请输入您的电子邮件和密码。",
        loginAlertAdmin: "正在以管理员身份登录。",
        loginAlertWelcome: "，欢迎您！", // 이름 뒤에 붙어 "张三，欢迎您！" 형태로 출력됩니다.
        loginAlertFail: "登录失败：请检查您的电子邮件或密码。",
        loginAlertNetwork: "无法与服务器通信。",
        user: "用户"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'ko');

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('appLanguage', lang);
    };

    // 만약 사전에 없는 언어 코드가 들어오면 기본값(ko)으로 안전하게 처리
    const currentDictionary = DIC[language] || DIC['ko'];

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t: currentDictionary }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);