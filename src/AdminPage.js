import React, { useState, useEffect } from 'react';

const AdminPage = () => {
    const [pendingReviews, setPendingReviews] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [notice, setNotice] = useState('');

    const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420'
    };

    useEffect(() => {
        // 1. 대기 중인 리뷰 조회
        fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/reviews/pending', { headers })
            .then(res => res.json())
            .then(data => setPendingReviews(data))
            .catch(err => console.error("리뷰 로딩 실패:", err));

        // 2. 환전 신청 목록 조회
        fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/admin/exchange/requests', { headers })
            .then(res => {
                if (!res.ok) throw new Error("서버 응답 오류");
                return res.json();
            })
            .then(data => setPendingRequests(data || []))
            .catch(err => {
                console.error("환전 목록 로딩 실패:", err);
                setPendingRequests([]);
            });
    }, []);

    const handleReviewAction = async (id, status) => {
        const res = await fetch(`https://eleven-acquaint-strongly.ngrok-free.dev/api/reviews/${id}/status`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ status })
        });

        if (res.ok) {
            alert(status === 'APPROVED' ? "리뷰가 수락되었습니다." : "리뷰가 거절되었습니다.");
            setPendingReviews(pendingReviews.filter(r => r.id !== id));
        } else {
            alert("상태 변경 중 오류가 발생했습니다.");
        }
    };

    const handleApproveExchange = async (id) => {
        if (window.confirm("환전을 승인하시겠습니까?")) {
            const res = await fetch(`https://eleven-acquaint-strongly.ngrok-free.dev/api/admin/exchange/approve/${id}`, {
                method: 'POST',
                headers
            });
            if (res.ok) {
                alert("환전이 승인되었습니다.");
                setPendingRequests(pendingRequests.filter(req => req.id !== id));
            } else {
                alert("승인 처리 중 오류가 발생했습니다.");
            }
        }
    };

    const handleRejectExchange = async (id) => {
        const reason = window.prompt("거절 사유를 입력하세요:");
        if (reason === null || reason.trim() === "") return;

        const res = await fetch(`https://eleven-acquaint-strongly.ngrok-free.dev/api/admin/exchange/reject/${id}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ reason: reason })
        });

        if (res.ok) {
            alert("환전 신청이 거절되었습니다.");
            setPendingRequests(pendingRequests.filter(req => req.id !== id));
        } else {
            alert("거절 처리 중 오류가 발생했습니다.");
        }
    };

    const postNotice = async () => {
        await fetch('https://eleven-acquaint-strongly.ngrok-free.dev/api/notices', {
            method: 'POST',
            headers,
            body: JSON.stringify({ content: notice })
        });
        alert("공지사항이 등록되었습니다.");
        setNotice('');
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={styles.headerContainer}>
                <h1>관리자 대시보드</h1>
                <button onClick={handleLogout} style={styles.logoutButton}>로그아웃</button>
            </div>

            <section style={styles.section}>
                <h2>📢 공지사항 작성</h2>
                <textarea value={notice} onChange={(e) => setNotice(e.target.value)} placeholder="공지 내용을 입력하세요..." style={styles.textarea} />
                <br />
                <button onClick={postNotice} style={styles.postButton}>공지사항 등록</button>
            </section>

            <hr style={{ margin: '40px 0' }} />

            <section style={styles.section}>
                <h2>💰 환전 신청 검토</h2>
                {pendingRequests.length === 0 ? <p>대기 중인 환전 신청이 없습니다.</p> : pendingRequests.map(req => (
                    <div key={req.id} style={styles.card}>
                        <p><strong>{req.userEmail}</strong> 님이 {req.amount.toLocaleString()} P 환전 신청</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleApproveExchange(req.id)} style={styles.approveBtn}>승인</button>
                            <button onClick={() => handleRejectExchange(req.id)} style={styles.rejectBtn}>거절</button>
                        </div>
                    </div>
                ))}
            </section>

            <section>
                <h2>📝 리뷰 검토 (대기 중)</h2>
                {pendingReviews.length === 0 ? <p>검토할 리뷰가 없습니다.</p> : pendingReviews.map(rev => (
                    <div key={rev.id} style={styles.card}>
                        <h3>{rev.placeName}</h3>
                        <p>{rev.content}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleReviewAction(rev.id, 'APPROVED')} style={styles.approveBtn}>수락</button>
                            <button onClick={() => handleReviewAction(rev.id, 'REJECTED')} style={styles.rejectBtn}>거절</button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

const styles = {
    headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '10px' },
    logoutButton: { padding: '10px 18px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
    section: { marginBottom: '30px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' },
    textarea: { width: '100%', height: '100px', marginBottom: '10px', padding: '10px', borderRadius: '5px' },
    card: { border: '1px solid #ddd', padding: '20px', marginBottom: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    postButton: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    approveBtn: { padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    rejectBtn: { padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminPage;