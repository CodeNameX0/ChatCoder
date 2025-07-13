# ChatCoder v.2.1.0

ChatCoder는 채팅, 문서 관리, 게임 기능을 제공하는 동적 웹 플랫폼입니다.

## 🌟 주요 기능

- **실시간 채팅**: 카카오톡 스타일의 직관적인 채팅 인터페이스
- **문서 관리**: 문서 작성, 수정, 댓글 시스템
- **게임 런처**: 외부 게임 사이트 연결
- **사용자 인증**: 로그인/회원가입 시스템
- **다크/라이트 모드**: 사용자 맞춤 테마 설정
- **파일 업로드**: 문서에 파일 첨부 기능
- **한국어 지원**: 완전한 한국어 인터페이스

## 🚀 기술 스택

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **데이터**: JSON 파일 기반 저장
- **실시간 통신**: Socket.io
- **파일 업로드**: Multer
- **보안**: bcrypt, express-session

## 📦 설치 및 실행

### 로컬 환경

```bash
# 저장소 클론
git clone <repository-url>
cd ChatCoder

# 의존성 설치
npm install

# 서버 시작
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### Railway 배포

1. [Railway](https://railway.app)에 가입
2. GitHub 저장소 연결
3. 자동 배포 설정
4. 환경 변수 설정 (필요시)

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일/데스크톱 최적화
- **모던 인터페이스**: 깔끔하고 직관적인 디자인
- **접근성**: 고대비 색상과 명확한 텍스트
- **애니메이션**: 부드러운 전환 효과

## 📱 브라우저 지원

- Chrome (권장)
- Firefox
- Safari
- Edge

## 🔧 환경 변수

### 필수 환경 변수
```bash
# 서버 설정
PORT=3000                           # 서버 포트 (기본값: 3000)
NODE_ENV=production                 # 운영 환경 설정

# 보안 설정
SESSION_SECRET=your_session_secret  # 세션 암호화 키 (필수)
USERS_DATA=base64_encoded_users     # Base64 인코딩된 사용자 데이터

# 파일 업로드
MAX_FILE_SIZE=10485760             # 최대 파일 크기 (10MB)
```

### 사용자 데이터 설정 방법

1. **로컬 개발**:
   ```bash
   # .env 파일 생성
   cp .env.example .env
   
   # 사용자 데이터 인코딩 (개발시에만)
   node encode-users.js
   
   # 출력된 USERS_DATA 값을 .env에 복사
   ```

2. **Railway 배포**:
   - Railway 대시보드 → Variables 탭
   - 환경 변수 직접 입력:
     ```
     SESSION_SECRET=your_unique_session_secret_key
     USERS_DATA=your_base64_encoded_users_data
     NODE_ENV=production
     ```

### 보안 주의사항
- ⚠️ **절대 비밀번호를 코드에 하드코딩하지 마세요**
- 🔐 **SESSION_SECRET은 충분히 복잡한 값으로 설정**
- 🚫 **encode-users.js는 배포 전에 삭제하거나 .gitignore에 추가**
- 🔄 **정기적으로 비밀번호 변경 권장**

## 📂 프로젝트 구조

```
ChatCoder/
├── data/                # JSON 데이터 파일
├── uploads/             # 업로드된 파일
├── server.js           # Express 서버
├── script.js           # 클라이언트 JavaScript
├── styles.css          # 스타일시트
├── *.html              # HTML 페이지들
└── package.json        # 프로젝트 설정
```

## 🤝 기여하기

1. Fork 프로젝트
2. 새 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 개발팀

ChatCoder Team

---

💡 **Tip**: 라이트 모드와 다크 모드를 전환하려면 우상단의 토글 버튼을 클릭하세요!
