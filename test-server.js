const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 기본 라우트
app.get('/', (req, res) => {
    res.send(`
        <h1>ChatCoder Test Server</h1>
        <p>서버가 정상적으로 실행 중입니다!</p>
        <p>포트: ${PORT}</p>
        <p>Node 버전: ${process.version}</p>
    `);
});

// 헬스체크
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 테스트 서버가 포트 ${PORT}에서 실행 중입니다!`);
});
