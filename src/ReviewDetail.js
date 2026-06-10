import React, { useState, useEffect } from 'react';

const ReviewDetail = ({ review, currentUser, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // 💡 댓글 목록을 불러오는 함수 (재사용 가능하게 별도 정의)
    const fetchComments = async () => {
        try {
            const res = await fetch(`https://eleven-acquaint-strongly.ngrok-free.dev/api/comments/${review.id}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("댓글 불러오기 실패:", error);
        }
    };

    // 리뷰가 열릴 때마다 댓글 로드
    useEffect(() => {
        fetchComments();
    }, [review.id]);

    // 댓글 작성
    const handleAddComment = async () => {
        if (!newComment.trim()) return; // 빈 댓글 방지

        try {
            const res = await fetch(`https://eleven-acquaint-strongly.ngrok-free.dev/api/comments/${review.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    writerEmail: currentUser ? currentUser.email : "게스트",
                    content: newComment
                })
            });

            if (res.ok) {
                setNewComment('');
                fetchComments(); // 💡 등록 성공 후 즉시 목록 새로고침
            }
        } catch (error) {
            console.error("댓글 작성 실패:", error);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>📍 {review.spotName}</h2>
                    <button onClick={onClose} style={styles.closeXBtn}>×</button>
                </div>

                <p style={styles.content}>{review.content}</p>

                <hr style={styles.divider} />

                <h3>💬 댓글 {comments.length}개</h3>
                <div style={styles.commentList}>
                    {comments.length > 0 ? (
                        comments.map(c => (
                            <div key={c.id} style={styles.commentItem}>
                                <strong>{c.writerEmail.split('@')[0]}:</strong> {c.content}
                            </div>
                        ))
                    ) : (
                        <p style={styles.noComment}>첫 댓글을 남겨보세요!</p>
                    )}
                </div>

                <div style={styles.inputArea}>
                    <input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                        style={styles.input}
                    />
                    <button onClick={handleAddComment} style={styles.submitBtn}>등록</button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeXBtn: { border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' },
    content: { fontSize: '16px', color: '#333', margin: '20px 0' },
    divider: { margin: '20px 0', border: '0', borderTop: '1px solid #eee' },
    commentList: { flex: 1, overflowY: 'auto', marginBottom: '20px', maxHeight: '200px' },
    commentItem: { marginBottom: '8px', padding: '10px', backgroundColor: '#f4f4f4', borderRadius: '8px', fontSize: '14px' },
    noComment: { fontSize: '13px', color: '#888', textAlign: 'center' },
    inputArea: { display: 'flex', gap: '10px' },
    input: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' },
    submitBtn: { padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default ReviewDetail;