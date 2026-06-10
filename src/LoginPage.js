import React, { useState } from 'react';
import { useLanguage } from './LanguageContext'; // 💡 1. 컨텍스트 호출

const LoginPage = ({ onLoginSuccess, onGuestSuccess, onAdminSuccess, onBack, onNavigateSignup }) => {
  const { t } = useLanguage(); // 💡 2. 사전 데이터 가져오기

  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId || !userPw) {
      alert(t.loginAlertEmpty || "아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userId, password: userPw })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role === 'ADMIN') {
          alert(t.loginAlertAdmin || "관리자 계정으로 접속합니다.");
          onAdminSuccess();
        } else {
          // 💡 유저 이름 뒤에 다국어 환영 메시지 연결
          alert(`${data.name || t.user || '사용자'}${t.loginAlertWelcome || '님 환영합니다!'}`);
          onLoginSuccess();
        }
      } else {
        alert(data.message || t.loginAlertFail || "로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("통신 에러:", error);
      alert(t.loginAlertNetwork || "서버와 통신할 수 없습니다.");
    }
  };

  return (
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h1 style={styles.title}>DEEP LOCAL</h1>
          {/* 💡 3. 화면 텍스트를 다국어 사전과 매핑 */}
          <p style={styles.subtitle}>{t.loginSubtitle || "현지인이 추천하는 숨은 명소 찾기"}</p>

          <form onSubmit={handleLogin} style={styles.form}>
            <input
                type="text"
                placeholder={t.emailPlaceholder || "이메일(아이디)"}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder={t.pwPlaceholder || "비밀번호"}
                value={userPw}
                onChange={(e) => setUserPw(e.target.value)}
                style={styles.input}
            />
            <button type="submit" style={styles.loginButton}>{t.loginBtn || "로그인"}</button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerText}>{t.orText || "또는"}</span>
          </div>

          <button onClick={onGuestSuccess} style={styles.guestButton}>
            {t.guestBtn || "비회원으로 둘러보기"}
          </button>

          <div style={styles.footer}>
            <p>
              {t.noAccount || "계정이 없으신가요? "}
              <button onClick={onNavigateSignup} style={styles.linkButton}>{t.signupLink || "회원가입"}</button>
            </p>
            <button onClick={onBack} style={styles.backButton}>{t.backBtn || "← 뒤로가기"}</button>
          </div>
        </div>
      </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '20px'
  },
  loginBox: {
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a73e8', marginBottom: '10px' },
  subtitle: { fontSize: '14px', color: '#777', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' },
  loginButton: { padding: '14px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  divider: { margin: '20px 0', borderTop: '1px solid #eee', position: 'relative' },
  dividerText: { backgroundColor: 'white', padding: '0 10px', color: '#aaa', fontSize: '12px', position: 'relative', top: '-10px' },
  guestButton: { width: '100%', padding: '14px', backgroundColor: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  footer: { marginTop: '20px', fontSize: '14px' },
  linkButton: { background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' },
  backButton: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginTop: '10px' }
};

export default LoginPage;