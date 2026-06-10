import React, { useState } from 'react';

const RegisterPage = ({ onRegisterSuccess, onBack }) => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 설계된 USER 클래스 구조에 따라 초기값 설정 (points: 0, follower: [])
    console.log("새로운 사용자 객체 생성:", {
      id: formData.userId,
      password: formData.password,
      points: 0,
      followers: []
    });

    alert("회원가입이 완료되었습니다!");
    onRegisterSuccess();
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <h2 style={styles.title}>회원가입</h2>
        <p style={styles.subtitle}>DEEP LOCAL의 멤버가 되어 숨은 명소를 공유하세요.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="userId"
            placeholder="아이디"
            onChange={handleChange}
            style={styles.input} required
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            style={styles.input} required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            onChange={handleChange}
            style={styles.input} required
          />
          <button type="submit" style={styles.button}>가입하기</button>
        </form>
        <button onClick={onBack} style={styles.backButton}>뒤로가기</button>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' },
  registerBox: { padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' },
  title: { color: '#34a853', fontSize: '28px', marginBottom: '10px' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column' },
  input: { padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ddd' },
  button: { padding: '12px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  backButton: { marginTop: '15px', background: 'none', border: 'none', color: '#777', cursor: 'pointer', textDecoration: 'underline' }
};

export default RegisterPage;