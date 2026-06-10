import React, { useState, useEffect } from 'react';
// 💡 react-router-dom은 기존 상태 기반 라우팅과 충돌하므로 사용하지 않습니다.
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import MainPage from './MainPage';
import ProfilePage from './ProfilePage';
import ExchangePage from './ExchangePage';
import AdminPage from './AdminPage';
import LoginPage from './LoginPage';
import { LanguageProvider, useLanguage } from './LanguageContext';

// 💡 컨텍스트의 언어 코드(ko, en, ja, zh)와 일치하도록 키값을 수정했습니다.
const translations = {
    ko: { landingTitle: "진짜 로컬의 숨겨진 보물을 찾아보세요", landingSub: "뻔한 관광지 대신, 당신만이 발견한 희귀한 장소의 가치를 공유하고 보상을 받으세요.", getStarted: "지금 탐험 시작하기" },
    en: { landingTitle: "Discover Hidden Local Gems", landingSub: "Share the value of rare places you've found and get rewarded.", getStarted: "Start Exploring" },
    ja: { landingTitle: "本物のローカル穴場を見つけよう", landingSub: "ありふれた観光地の代わりに、あなただけが知っている場所を共有して報酬をゲット。", getStarted: "今すぐ探索を始める" },
    zh: { landingTitle: "探索隐藏景点", landingSub: "与其去大众景点，不如分享您发现的稀有地点并获得奖励。", getStarted: "现在开始探索" }
};

// 💡 실제 앱 로직이 담긴 컴포넌트
function AppContent() {
    const { language, changeLanguage } = useLanguage(); // Context에서 언어 상태 가져오기

    const [currentPage, setCurrentPage] = useState('landing');
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [authMode, setAuthMode] = useState('selection');
    const [userPoints, setUserPoints] = useState(0);
    const [userNationality, setUserNationality] = useState('South Korea');
    const [allReviews, setAllReviews] = useState([
        { id: 1, authorEmail: 'test@test.com', placeName: '대구 앞산 전망대 야경 카페', country: 'South Korea', region: '대구', content: '사람들이 잘 모르는 구석진 골목에 있는 카페인데 고즈넉하고 전경이 끝내줍니다. 진짜 힐링 명소예요.', date: '2026-05-20' }
    ]);

    // 로그인 유저 상태 동기화
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    // 현재 설정된 언어에 맞는 랜딩페이지 텍스트 매핑
    const t = translations[language] || translations['ko'];

    const handleAdminSuccess = () => setCurrentPage('admin');

    const handleSignUpSubmit = async (userData) => {
        try {
            console.log("백엔드로 보내는 가입 데이터:", userData); // 디버깅용
            const response = await fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert('회원가입 완료! 로그인해주세요.');
                setAuthMode('login');
            } else {
                const errorData = await response.text();
                alert(`회원가입 실패 원인 (${response.status}):\n${errorData}`);
            }
        } catch (error) {
            alert('백엔드 서버 연결 실패');
        }
    };

    const handleLoginSubmit = async (email, password) => {
        try {
            const response = await fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password: password.trim() })
            });

            const data = await response.json();

            if (response.ok) {
                setCurrentUser(data);
                setUserPoints(data.points || 0);
                data.role === 'ADMIN' ? handleAdminSuccess() : setCurrentPage('main');
            } else {
                const errorMessage = data.message ? data.message : "서버 에러 원인: " + JSON.stringify(data);
                alert(errorMessage);
            }
        } catch (error) {
            alert('서버 연결 실패');
        }
    };

    const handleGuestLogin = () => {
        setCurrentUser(null);
        setUserPoints(0);
        setCurrentPage('main');
    };

    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            {/* 💡 상단 언어 선택 네비게이션 (Context의 changeLanguage 사용) */}
            <nav style={styles.langNav}>
                {[
                    { code: 'ko', label: 'KR' },
                    { code: 'en', label: 'EN' },
                    { code: 'ja', label: 'JP' },
                    { code: 'zh', label: 'CN' }
                ].map((l) => (
                    <button
                        key={l.code}
                        onClick={() => changeLanguage(l.code)}
                        style={{ ...styles.langBtn, color: language === l.code ? '#1a73e8' : '#888' }}
                    >
                        {l.label}
                    </button>
                ))}
            </nav>

            {currentPage === 'landing' && <LandingPage t={t} onStart={() => setCurrentPage('auth')} />}

            {currentPage === 'auth' && (
                <AuthPage
                    t={t} authMode={authMode} setAuthMode={setAuthMode}
                    onLogin={handleLoginSubmit} onSignUp={handleSignUpSubmit}
                    onGuestSuccess={handleGuestLogin}
                />
            )}

            {currentPage === 'main' && (
                <MainPage
                    t={t}
                    currentUser={currentUser}
                    userPoints={userPoints}
                    allReviews={allReviews}
                    setAllReviews={setAllReviews}
                    onProfile={() => setCurrentPage('profile')}
                    onLogout={() => { setCurrentUser(null); setCurrentPage('landing'); }}
                />
            )}

            {currentPage === 'profile' && (
                <ProfilePage
                    t={t}
                    currentUser={currentUser}
                    userPoints={userPoints}
                    allReviews={allReviews}
                    userNationality={userNationality}
                    setUserNationality={setUserNationality}
                    onBack={() => setCurrentPage('main')}
                    onExchange={() => setCurrentPage('exchange')}
                    onNavigateAuth={() => setCurrentPage('auth')}
                />
            )}

            {currentPage === 'exchange' && (
                <ExchangePage
                    t={t}
                    currentUser={currentUser}
                    userPoints={userPoints}
                    setUserPoints={setUserPoints}
                    userNationality={userNationality}
                    onBack={() => setCurrentPage('profile')}
                />
            )}

            {currentPage === 'admin' && <AdminPage />}
        </div>
    );
}

const styles = {
    langNav: { display: 'flex', justifyContent: 'flex-end', padding: '10px 40px', backgroundColor: '#fff', borderBottom: '1px solid #eee', gap: '15px' },
    langBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }
};

// 💡 최상단에서 Provider로 앱 전체를 감싸서 내보냅니다.
export default function App() {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}
