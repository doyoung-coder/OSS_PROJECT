import React, { useState } from 'react';

const AuthPage = ({ t, authMode, setAuthMode, onLogin, onSignUp, onGuestSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("정보를 모두 입력해주세요.");
            return;
        }
        if (authMode === 'login') {
            onLogin(email, password);
        } else {
            if (!name.trim()) {
                alert("닉네임을 입력해주세요.");
                return;
            }
            onSignUp({ name, email, password });
        }
    };

    // 공통 레이아웃을 감싸는 래퍼
    const renderCard = (children) => (
        <div style={styles.container}>
            <div style={styles.card}>
                {children}
            </div>
        </div>
    );

    // 1. 초기 선택 화면
    if (authMode === 'selection') {
        return renderCard(
            <>
                <h2 style={styles.title}>{t.welcome || "환영합니다"}</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>{t.authDesc || "계속하려면 선택하세요"}</p>
                <button onClick={() => setAuthMode('login')} style={styles.button}>로그인</button>
                <button onClick={() => setAuthMode('signup')} style={{...styles.button, backgroundColor: '#6c757d', marginTop: '10px'}}>회원가입</button>
                <button onClick={onGuestSuccess} style={{...styles.button, backgroundColor: 'transparent', color: '#1a73e8', border: '1px solid #1a73e8', marginTop: '10px'}}>비회원 모드</button>
            </>
        );
    }

    // 2. 로그인 및 회원가입 입력 화면
    return renderCard(
        <form onSubmit={handleSubmit}>
            <h2 style={styles.title}>{authMode === 'login' ? "로그인" : "회원가입"}</h2>

            {authMode === 'signup' && (
                <input style={styles.input} type="text" placeholder="닉네임" value={name} onChange={(e) => setName(e.target.value)} required />
            )}

            <input style={styles.input} type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input style={styles.input} type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit" style={styles.button}>
                {authMode === 'login' ? "로그인" : "회원가입"}
            </button>

            <button type="button" onClick={() => setAuthMode('selection')} style={{...styles.button, backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ddd', marginTop: '10px'}}>
                뒤로가기
            </button>
        </form>
    );
};

// 스타일 객체는 그대로 사용
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7fa' },
    card: { width: '350px', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center' },
    input: { width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' },
    title: { marginBottom: '20px', color: '#333' }
};

export default AuthPage;