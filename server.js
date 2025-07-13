// 환경 변수 로드 (dotenv가 없어도 실행되도록)
try {
    require('dotenv').config();
} catch (error) {
    console.log('dotenv not available, using environment variables only');
}

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// 데이터 파일 경로
const DATA_DIR = path.join(__dirname, 'data');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');

// 업로드 디렉토리 경로
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// 데이터 디렉토리 생성 (안전하게)
try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log('📁 데이터 디렉토리 생성됨:', DATA_DIR);
    }
} catch (error) {
    console.warn('⚠️ 데이터 디렉토리 생성 실패 (읽기 전용 파일시스템일 수 있음):', error.message);
}

// 업로드 디렉토리 생성 (안전하게)
try {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        console.log('📁 업로드 디렉토리 생성됨:', UPLOADS_DIR);
    }
} catch (error) {
    console.warn('⚠️ 업로드 디렉토리 생성 실패 (읽기 전용 파일시스템일 수 있음):', error.message);
}

// Multer 설정 (파일 업로드)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        // 파일명: 타임스탬프_원본파일명
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB 제한
    },
    fileFilter: function (req, file, cb) {
        // 허용할 파일 형식
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('허용되지 않는 파일 형식입니다.'));
        }
    }
});

// 데이터 로드 함수
function loadData(filePath, defaultData) {
    console.log(`🔍 데이터 로드 시도: ${filePath}`);
    try {
        if (fs.existsSync(filePath)) {
            console.log(`✅ 파일 존재함: ${filePath}`);
            const data = fs.readFileSync(filePath, 'utf8');
            if (data.trim()) {
                const parsedData = JSON.parse(data);
                console.log(`📊 파싱된 데이터 (${Array.isArray(parsedData) ? parsedData.length : typeof parsedData}):`, Array.isArray(parsedData) ? `${parsedData.length}개 항목` : 'object');
                return parsedData;
            } else {
                console.log(`⚠️ 빈 파일: ${filePath}, 기본값 사용`);
            }
        } else {
            console.log(`ℹ️ 파일 없음: ${filePath}, 기본값 사용 (정상)`);
        }
    } catch (error) {
        console.error(`💥 데이터 로드 실패 (${filePath}):`, error.message);
    }
    console.log(`🔄 기본값 반환:`, Array.isArray(defaultData) ? `배열 ${defaultData.length}개` : typeof defaultData);
    return defaultData;
}

// 데이터 저장 함수
function saveData(filePath, data) {
    console.log(`💾 데이터 저장 시도: ${filePath}`);
    console.log(`📦 저장할 데이터:`, data);
    console.log(`🔢 데이터 항목 수: ${Array.isArray(data) ? data.length : 'N/A'}`);
    
    try {
        // 디렉토리 존재 확인
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            console.log(`📁 디렉토리 생성: ${dir}`);
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const jsonString = JSON.stringify(data, null, 2);
        console.log(`📝 JSON 문자열 길이: ${jsonString.length}`);
        console.log(`📄 JSON 내용 미리보기: ${jsonString.substring(0, 200)}...`);
        
        // 동기적 파일 쓰기
        fs.writeFileSync(filePath, jsonString, 'utf8');
        console.log(`✅ 데이터 저장 완료: ${filePath}`);
        
        // 저장 후 파일 확인
        if (fs.existsSync(filePath)) {
            const fileSize = fs.statSync(filePath).size;
            console.log(`📊 저장된 파일 크기: ${fileSize} bytes`);
            
            // 저장된 내용 재확인
            const savedContent = fs.readFileSync(filePath, 'utf8');
            console.log(`🔍 저장된 파일 내용 확인: ${savedContent.substring(0, 100)}...`);
        } else {
            console.error(`❌ 파일 저장 후에도 파일이 존재하지 않음: ${filePath}`);
        }
    } catch (error) {
        console.error(`💥 데이터 저장 실패 (${filePath}):`, error);
        console.error(`🔍 오류 상세 정보:`, {
            name: error.name,
            message: error.message,
            code: error.code,
            path: error.path
        });
    }
}

// 서버 시작 시 데이터 로드
console.log('🚀 서버 시작 - 데이터 로딩 중...');

// 파일 저장 테스트
console.log('🧪 파일 저장 기능 테스트 시작...');
try {
    const testData = [{"test": "저장 테스트", "timestamp": new Date()}];
    saveData(CHATS_FILE, testData);
    console.log('✅ 파일 저장 테스트 성공');
} catch (error) {
    console.error('❌ 파일 저장 테스트 실패:', error);
}

// 사용자 데이터 (하드코딩)
function loadUsersFromEnv() {
    // 실제 사용자 데이터
    return [
        {"username": "CodeNameX0(정승유)👑", "password": "Qwerty11"},
        {"username": "seomin(서정민)", "password": "QI198B"},
        {"username": "bbangbrothers(윤겸)", "password": "Y3ODGK"},
        {"username": "Joo(주한민)", "password": "FZUQM4"},
        {"username": "Lee_Noel(전태현)", "password": "LZQAX1"},
        {"username": "Ohw-chessuser(김태윤)", "password": "SHNLL7"},
        {"username": "Choi_Nick_chopstick(최시윤)", "password": "ZFO3HY"},
        {"username": "SupepGood(이시완)", "password": "D6WPTR"},
        {"username": "Nok-wodu-okro(김승욱)", "password": "ORD436"}
    ];
}

const users = loadUsersFromEnv();
console.log(`👥 로딩된 사용자 수: ${users.length}`);
console.log(`🔐 사용자 데이터 (비밀번호 마스킹):`, users.map(u => ({
    username: u.username, 
    password: u.password.substring(0, 3) + '***'
})));

// 세션 비밀키도 환경 변수에서 로드
const sessionSecret = process.env.SESSION_SECRET || 'default-secret-key-change-this';
if (sessionSecret === 'default-secret-key-change-this') {
    console.warn('⚠️ 기본 세션 비밀키를 사용중입니다. 운영 환경에서는 SESSION_SECRET을 설정해주세요.');
}

console.log('📝 문서 데이터 로딩...');
let documents = loadData(DOCUMENTS_FILE, []);
console.log(`📊 로딩된 문서 수: ${documents.length}`);
if (documents.length > 0) {
    documents.forEach((doc, index) => {
        console.log(`  ${index + 1}. "${doc.title}" by ${doc.author} (ID: ${doc.id})`);
    });
}

let documentIdCounter = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
console.log(`🔢 다음 문서 ID: ${documentIdCounter}`);

console.log('💬 채팅 데이터 로딩...');
let chats = loadData(CHATS_FILE, []);
console.log(`📊 로딩된 채팅 수: ${chats.length}`);

console.log('✅ 모든 데이터 로딩 완료!');

// Middleware 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS에서만 secure 쿠키 사용
        maxAge: 24 * 60 * 60 * 1000 // 24시간
    }
}));

// 정적 파일 제공
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 업로드된 파일 접근 허용

// 사용자 등록 API (테스트용) - 서버 내 배열에 추가
app.post('/register', (req, res) => {
    const { username, password } = req.body;    // 기존 사용자 확인
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send({ message: '이미 존재하는 사용자입니다.' });
    }    // 새 사용자 추가 (메모리에만, 파일에는 저장하지 않음)
    users.push({ username, password });
    console.log(`사용자 등록 성공: ${username}`);
    console.log('현재 등록된 사용자들:', users.map(u => u.username));
    res.status(201).send({ message: '사용자 등록 성공!' });
});

// 로그인 API - 서버 내 배열에서 사용자 조회
app.post('/login', (req, res) => {
    const { username, password } = req.body;    // 서버 내 배열에서 사용자 조회
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.user = username; // 세션에 사용자 정보 저장
        console.log(`==========================================`);
        console.log(`🎉 로그인 성공: ${username}`);
        console.log(`📅 시간: ${new Date().toLocaleString()}`);
        console.log(`� 사용자: ${username}`);
        if (username === 'secret') {
            console.log(`🔐 SECRET 사용자 로그인 - 히든 탭 발견!`);
        } else {
            console.log(`🚀 명령 처리: window.open으로 새 창에서 메인 페이지를 엽니다`);
        }
        console.log(`📋 현재 등록된 사용자: ${users.map(u => u.username).join(', ')}`);
        console.log(`==========================================`);
        res.status(200).send({ message: '로그인 성공!', username });
    } else {
        console.log(`❌ 로그인 실패: ${username} - 사용자를 찾을 수 없습니다`);
        console.log(`📋 등록된 사용자들: ${users.map(u => u.username).join(', ')}`);
        res.status(401).send({ message: '로그인 실패! 아이디 또는 비밀번호를 확인하세요.' });
    }
});

// 로그아웃 API
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).send({ message: '로그아웃 성공!' });
    });
});

// 문서 저장 API - 파일 업로드 지원
app.post('/document', upload.array('files', 5), (req, res) => {
    console.log('📝 문서 저장 요청 받음');
    console.log('📋 req.body:', req.body);
    console.log('📎 업로드된 파일:', req.files);
    
    const { title, content, author } = req.body;

    // 세션 또는 요청 본문에서 사용자 확인
    const currentUser = req.session.user || author;
    
    console.log('👤 사용자 확인:');
    console.log('- req.session.user:', req.session.user);
    console.log('- author from body:', author);
    console.log('- currentUser:', currentUser);
    
    if (!currentUser) {
        console.log('❌ 문서 저장 실패: 로그인되지 않음');
        return res.status(403).send({ message: '로그인이 필요합니다.' });
    }

    if (!title || !content) {
        console.log('❌ 문서 저장 실패: 제목 또는 내용이 비어있음');
        console.log('- title:', title);
        console.log('- content:', content);
        return res.status(400).send({ message: '제목과 내용을 모두 입력해주세요.' });
    }

    // 첨부파일 정보 처리
    const attachedFiles = req.files ? req.files.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: `/uploads/${file.filename}`
    })) : [];

    const newDocument = {
        id: documentIdCounter++,
        title,
        content,
        author: currentUser,
        comments: [],
        attachedFiles: attachedFiles,
        createdAt: new Date()
    };
    
    console.log('📄 새 문서 생성:', newDocument);
    
    // 저장 전 배열 상태 확인
    console.log(`📊 저장 전 documents 배열 길이: ${documents.length}`);
    
    // 메모리 배열에 추가
    documents.push(newDocument);
    
    // 저장 후 배열 상태 확인
    console.log(`📊 저장 후 documents 배열 길이: ${documents.length}`);
    
    // 파일에 저장
    console.log('💾 파일에 저장 시도...');
    saveData(DOCUMENTS_FILE, documents);
    
    console.log(`✅ 문서 저장 완료: "${title}" by ${currentUser}`);
    console.log(`📊 현재 총 문서 수: ${documents.length}`);
    res.status(200).send({ message: `문서 "${title}"가 저장되었습니다.`, document: newDocument });
});

// 문서 조회 API - 파일에서 실시간으로 조회
app.get('/api/documents', (req, res) => {
    console.log('📋 문서 조회 API 호출됨');
    console.log('📂 파일 경로:', DOCUMENTS_FILE);
    console.log('📁 파일 존재 여부:', fs.existsSync(DOCUMENTS_FILE));
    
    if (fs.existsSync(DOCUMENTS_FILE)) {
        try {
            const fileContent = fs.readFileSync(DOCUMENTS_FILE, 'utf8');
            console.log('📄 파일 내용:', fileContent);
        } catch (error) {
            console.error('파일 읽기 오류:', error);
        }
    }
    
    // 파일에서 최신 문서 데이터 로드
    const currentDocuments = loadData(DOCUMENTS_FILE, []);
    console.log(`� 로드된 문서 수: ${currentDocuments.length}`);
    
    if (currentDocuments.length > 0) {
        console.log('📝 문서 목록:');
        currentDocuments.forEach((doc, index) => {
            console.log(`  ${index + 1}. "${doc.title}" by ${doc.author} (ID: ${doc.id})`);
        });
    } else {
        console.log('📝 저장된 문서가 없습니다.');
    }
    
    res.status(200).send(currentDocuments);
});

// 댓글 추가 API - 파일과 메모리 동기화
app.post('/document/comment', (req, res) => {
    const { documentId, content, author } = req.body;

    // 세션 또는 요청 본문에서 사용자 확인
    const currentUser = req.session.user || author;
    
    if (!currentUser) {
        console.log('❌ 댓글 저장 실패: 로그인되지 않음');
        return res.status(403).send({ message: '로그인이 필요합니다.' });
    }

    // 메모리 배열에서 문서 찾기
    const document = documents.find(doc => doc.id == documentId);
    
    if (!document) {
        return res.status(404).send({ message: '문서를 찾을 수 없습니다.' });
    }

    const newComment = {
        author: currentUser,
        content: content,
        createdAt: new Date()
    };
    
    document.comments.push(newComment);
    
    // 파일에 저장
    saveData(DOCUMENTS_FILE, documents);
    
    console.log(`💬 댓글 추가됨: "${content}" by ${currentUser} in 문서 "${document.title}"`);
    res.status(200).send({ message: '댓글이 저장되었습니다.' });
});

// 채팅 메시지 저장 API
app.post('/api/chat', (req, res) => {
    console.log('💬 채팅 저장 요청 받음:', req.body);
    const { message, author } = req.body;

    // 세션 또는 요청 본문에서 사용자 확인
    const currentUser = req.session.user || author;
    
    console.log('👤 사용자 확인:');
    console.log('- req.session.user:', req.session.user);
    console.log('- author from body:', author);
    console.log('- currentUser:', currentUser);
    
    if (!currentUser) {
        console.log('❌ 채팅 저장 실패: 로그인되지 않음');
        return res.status(403).send({ message: '로그인이 필요합니다.' });
    }

    if (!message) {
        console.log('❌ 채팅 저장 실패: 메시지가 비어있음');
        return res.status(400).send({ message: '메시지를 입력해주세요.' });
    }

    const newChat = {
        id: chats.length + 1,
        author: currentUser,
        message: message.trim(),
        timestamp: new Date()
    };

    console.log('💬 새 채팅 생성:', newChat);
    console.log('📊 저장 전 chats 배열 길이:', chats.length);
    
    chats.push(newChat);
    console.log('📊 저장 후 chats 배열 길이:', chats.length);
    console.log('📋 현재 chats 배열:', chats);
    
    // 파일에 저장
    console.log('💾 채팅 파일 저장 시작...');
    saveData(CHATS_FILE, chats);
    
    // 저장 후 즉시 파일 내용 확인
    console.log('🔍 저장 후 파일 내용 재확인...');
    try {
        if (fs.existsSync(CHATS_FILE)) {
            const fileContent = fs.readFileSync(CHATS_FILE, 'utf8');
            console.log('📄 chats.json 실제 내용:', fileContent);
        } else {
            console.error('❌ chats.json 파일이 존재하지 않습니다!');
        }
    } catch (error) {
        console.error('💥 파일 확인 중 오류:', error);
    }
    
    console.log(`✅ 채팅 저장 완료: "${message}" by ${currentUser}`);
    console.log(`📊 현재 총 채팅 수: ${chats.length}`);
    
    res.status(200).send({ message: '채팅이 저장되었습니다.', chat: newChat });
});

// 채팅 메시지 조회 API
app.get('/api/chats', (req, res) => {
    console.log(`💬 채팅 조회 요청 - 총 ${chats.length}개 메시지`);
    
    if (chats.length > 0) {
        console.log('📝 채팅 목록:');
        chats.forEach((chat, index) => {
            console.log(`  ${index + 1}. "${chat.message}" by ${chat.author} (ID: ${chat.id})`);
        });
    } else {
        console.log('📝 저장된 채팅이 없습니다.');
    }
    
    res.status(200).send(chats);
});

// 문서 수정 API
app.put('/api/document/:id', (req, res) => {
    console.log('📝 문서 수정 요청:', req.params.id, req.body);
    
    const documentId = parseInt(req.params.id);
    const { title, content } = req.body;
    const currentUser = req.session.user;
    
    if (!currentUser) {
        return res.status(403).send({ message: '로그인이 필요합니다.' });
    }
    
    const documentIndex = documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
        return res.status(404).send({ message: '문서를 찾을 수 없습니다.' });
    }
    
    const document = documents[documentIndex];
    if (document.author !== currentUser) {
        return res.status(403).send({ message: '본인이 작성한 문서만 수정할 수 있습니다.' });
    }
    
    // 문서 수정
    documents[documentIndex].title = title;
    documents[documentIndex].content = content;
    documents[documentIndex].updatedAt = new Date();
    
    saveData(DOCUMENTS_FILE, documents);
    
    console.log(`✅ 문서 수정 완료: "${title}" by ${currentUser}`);
    res.status(200).send({ message: '문서가 수정되었습니다.', document: documents[documentIndex] });
});

// 문서 삭제 API
app.delete('/api/document/:id', (req, res) => {
    console.log('🗑️ 문서 삭제 요청:', req.params.id);
    
    const documentId = parseInt(req.params.id);
    const currentUser = req.session.user;
    
    if (!currentUser) {
        return res.status(403).send({ message: '로그인이 필요합니다.' });
    }
    
    const documentIndex = documents.findIndex(doc => doc.id === documentId);
    if (documentIndex === -1) {
        return res.status(404).send({ message: '문서를 찾을 수 없습니다.' });
    }
    
    const document = documents[documentIndex];
    if (document.author !== currentUser) {
        return res.status(403).send({ message: '본인이 작성한 문서만 삭제할 수 있습니다.' });
    }
    
    // 문서 삭제
    const deletedDocument = documents.splice(documentIndex, 1)[0];
    saveData(DOCUMENTS_FILE, documents);
    
    console.log(`🗑️ 문서 삭제 완료: "${deletedDocument.title}" by ${currentUser}`);
    res.status(200).send({ message: '문서가 삭제되었습니다.' });
});

// 댓글 수정 API
app.put('/api/document/:documentId/comment/:commentIndex', (req, res) => {
    console.log('💬 댓글 수정 요청:', req.params);
    
    const documentId = parseInt(req.params.documentId);
    const commentIndex = parseInt(req.params.commentIndex);
    const { content } = req.body;
    const currentUser = req.session.user;
    
    if (!currentUser) {
        return res.status(403).send({ message: '로그인이 필요합니다.' });
    }
    
    const document = documents.find(doc => doc.id === documentId);
    if (!document) {
        return res.status(404).send({ message: '문서를 찾을 수 없습니다.' });
    }
    
    if (!document.comments[commentIndex]) {
        return res.status(404).send({ message: '댓글을 찾을 수 없습니다.' });
    }
    
    if (document.comments[commentIndex].author !== currentUser) {
        return res.status(403).send({ message: '본인이 작성한 댓글만 수정할 수 있습니다.' });
    }
    
    // 댓글 수정
    document.comments[commentIndex].content = content;
    document.comments[commentIndex].updatedAt = new Date();
    
    saveData(DOCUMENTS_FILE, documents);
    
    console.log(`💬 댓글 수정 완료: "${content}" by ${currentUser}`);
    res.status(200).send({ message: '댓글이 수정되었습니다.' });
});

// 댓글 삭제 API
app.delete('/api/document/:documentId/comment/:commentIndex', (req, res) => {
    console.log('🗑️ 댓글 삭제 요청:', req.params);
    
    const documentId = parseInt(req.params.documentId);
    const commentIndex = parseInt(req.params.commentIndex);
    const currentUser = req.session.user;
    
    if (!currentUser) {
        return res.status(403).send({ message: '로그인이 필요합니다.' });
    }
    
    const document = documents.find(doc => doc.id === documentId);
    if (!document) {
        return res.status(404).send({ message: '문서를 찾을 수 없습니다.' });
    }
    
    if (!document.comments[commentIndex]) {
        return res.status(404).send({ message: '댓글을 찾을 수 없습니다.' });
    }
    
    if (document.comments[commentIndex].author !== currentUser) {
        return res.status(403).send({ message: '본인이 작성한 댓글만 삭제할 수 있습니다.' });
    }
    
    // 댓글 삭제
    const deletedComment = document.comments.splice(commentIndex, 1)[0];
    saveData(DOCUMENTS_FILE, documents);
    
    console.log(`🗑️ 댓글 삭제 완료: "${deletedComment.content}" by ${currentUser}`);
    res.status(200).send({ message: '댓글이 삭제되었습니다.' });
});

// 파일 업로드 API
app.post('/api/upload', upload.single('file'), (req, res) => {
    console.log('📁 파일 업로드 요청:', req.file);
    
    if (!req.file) {
        return res.status(400).send({ message: '파일이 업로드되지 않았습니다.' });
    }
    
    const currentUser = req.session.user;
    if (!currentUser) {
        return res.status(403).send({ message: '로그인이 필요합니다.' });
    }
    
    const fileInfo = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedBy: currentUser,
        uploadedAt: new Date(),
        url: `/uploads/${req.file.filename}`
    };
    
    console.log('✅ 파일 업로드 성공:', fileInfo);
    res.status(200).send({ 
        message: '파일이 업로드되었습니다.', 
        file: fileInfo 
    });
});

// 문서 검색 API
app.get('/api/search', (req, res) => {
    console.log('🔍 검색 API 호출됨');
    const query = req.query.q;
    console.log('📝 검색어:', query);
    
    if (!query || !query.trim()) {
        console.log('❌ 빈 검색어');
        return res.status(400).send({ message: '검색어를 입력해주세요.' });
    }
    
    try {
        // 제목과 내용에서 검색 (대소문자 구분 없음)
        const searchResults = documents.filter(doc => {
            const titleMatch = doc.title.toLowerCase().includes(query.toLowerCase());
            const contentMatch = doc.content.toLowerCase().includes(query.toLowerCase());
            const authorMatch = doc.author.toLowerCase().includes(query.toLowerCase());
            
            return titleMatch || contentMatch || authorMatch;
        });
        
        console.log(`📊 검색 결과: ${searchResults.length}개`);
        if (searchResults.length > 0) {
            searchResults.forEach((doc, index) => {
                console.log(`  ${index + 1}. "${doc.title}" by ${doc.author}`);
            });
        }
        
        res.status(200).send(searchResults);
    } catch (error) {
        console.error('💥 검색 중 오류:', error);
        res.status(500).send({ message: '검색 중 오류가 발생했습니다.' });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`🚀 ChatCoder 서버가 시작되었습니다!`);
    console.log(`📡 포트: ${PORT}`);
    console.log(`🌐 주소: http://localhost:${PORT}`);
    console.log(`📝 로그인 페이지: http://localhost:${PORT}/login.html`);
    console.log(`🏠 메인 페이지: http://localhost:${PORT}/index.html`);
    console.log(`💾 파일 기반 데이터 저장 활성화됨`);
    console.log(`📋 등록된 사용자: ${users.length}명`);
    console.log(`📄 저장된 문서: ${documents.length}개`);
    console.log(`💬 저장된 채팅: ${chats.length}개`);
    console.log(`⚡ 명령 처리 시스템 활성화됨`);
    console.log(`==========================================`);
});