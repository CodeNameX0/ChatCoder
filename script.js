document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 ChatCoder DOMContentLoaded 시작!');
    console.log('📍 현재 페이지 URL:', window.location.href);
    console.log('📋 document.title:', document.title);

    // 버튼 및 요소 가져오기
    const button1 = document.getElementById('button1'); // 채팅 버튼
    const button2 = document.getElementById('button2'); // 문서 버튼
    const game = document.getElementById('game'); // 게임 버튼
    const button3 = document.getElementById('button3'); // 로그인 버튼
    const profile = document.getElementById('profile'); // 프로필 영역
    const profileInfo = document.getElementById('profile-info'); // 프로필 정보
    const logoutButton = document.getElementById('logout-button'); // 로그아웃 버튼
    const deleteAccountButton = document.getElementById('delete-account-button'); // 계정 폐쇄 버튼

    const chatBox = document.getElementById('chat-box'); // 채팅창
    const chatInput = document.getElementById('chat-input'); // 메시지 입력란
    const sendButton = document.getElementById('send-button'); // Send 버튼

    // 로그인한 사용자 아이디 가져오기
    let loggedInUser = localStorage.getItem('loggedInUser');
    console.log('🔍 초기 로그인 상태 확인:', loggedInUser);
    
    // 페이지별 로그인/로그아웃 버튼 업데이트 함수
    function updateAuthButton() {
        console.log('🔄 인증 버튼 업데이트 중...', { loggedInUser, button3Present: !!button3 });
        
        if (button3) {
            if (loggedInUser) {
                // 로그인된 상태: 로그아웃 버튼으로 변경
                button3.textContent = '🚪 로그아웃';
                button3.className = 'btn btn-secondary';
                button3.onclick = handleLogout;
                console.log('✅ 로그아웃 버튼으로 변경됨');
            } else {
                // 로그아웃 상태: 로그인 버튼으로 변경
                button3.textContent = '🔐 로그인';
                button3.className = 'btn btn-accent';
                button3.onclick = () => { window.location.href = 'login.html'; };
                console.log('✅ 로그인 버튼으로 변경됨');
            }
        }
    }
    
    // 모든 페이지에서 로그인/로그아웃 버튼을 통일적으로 관리하는 함수
    function updateAllLoginButtons() {
        console.log('🔄 모든 로그인 버튼 상태 업데이트 중...', { loggedInUser });
        
        // 메인 페이지 버튼 업데이트
        updateMainProfileButton();
        
        // 채팅/문서 페이지의 로그인 버튼 업데이트
        const button3 = document.getElementById('button3');
        if (button3) {
            if (loggedInUser) {
                button3.textContent = '🚪 로그아웃';
                button3.className = 'btn btn-secondary';
                button3.onclick = handleLogout;
            } else {
                button3.textContent = '🔐 로그인';
                button3.className = 'btn btn-accent';
                button3.onclick = () => { window.location.href = 'login.html'; };
            }
        }
    }    // 프로필 버튼 업데이트 함수
    function updateMainProfileButton() {
        console.log('🔄 버튼 상태 업데이트 중...', { loggedInUser, button3Present: !!button3, profilePresent: !!profile });
        
        if (loggedInUser) {
            // 로그인된 상태: 로그인 버튼을 로그아웃 버튼으로 변경
            if (button3) {
                button3.textContent = '🚪 로그아웃';
                button3.className = 'btn btn-secondary';
                button3.onclick = handleLogout;
                console.log('✅ 로그인 버튼을 로그아웃 버튼으로 변경됨');
            }
            if (profile && profileInfo) {
                profile.style.display = 'block'; // 프로필 정보 표시
                
                // CodeNameX0(정승유)👑 사용자인지 확인하고 특별 스타일 적용
                if (loggedInUser === 'CodeNameX0(정승유)👑') {
                    profileInfo.innerHTML = `👤 환영합니다, <span class="special-user" data-username="${loggedInUser}">${loggedInUser}</span>님!`;
                } else {
                    profileInfo.textContent = `👤 환영합니다, ${loggedInUser}님!`;
                }
                
                console.log('✅ 프로필 정보 표시됨');
            }
        } else {
            // 로그아웃 상태: 로그아웃 버튼을 로그인 버튼으로 변경
            if (button3) {
                button3.textContent = '🔐 로그인';
                button3.className = 'btn btn-accent';
                button3.onclick = () => { window.location.href = 'login.html'; };
                console.log('✅ 로그아웃 버튼을 로그인 버튼으로 변경됨');
            }
            if (profile) {
                profile.style.display = 'none'; // 프로필 정보 숨기기
                console.log('✅ 프로필 정보 숨김');
            }
        }
    }

    // 로그아웃 처리 함수
    async function handleLogout() {
        console.log('🚪 로그아웃 처리 시작...');
        
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                // 로컬 스토리지에서 사용자 정보 제거
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('loginSuccess');
                
                // 전역 변수 업데이트
                loggedInUser = null;
                
                // 버튼 상태 업데이트
                updateAuthButton();
                updateMainProfileButton();
                
                // 페이지 새로고침하여 상태 반영
                setTimeout(() => {
                    location.reload();
                }, 1000);
                
                // 성공 메시지 표시
                showMainMessage('✅ 로그아웃되었습니다.', 'success');
                
                console.log('✅ 로그아웃 성공');
            } else {
                console.error('❌ 로그아웃 실패');
                showMainMessage('❌ 로그아웃 중 오류가 발생했습니다.', 'error');
            }
        } catch (error) {
            console.error('❌ 로그아웃 중 오류:', error);
            showMainMessage('❌ 로그아웃 중 오류가 발생했습니다.', 'error');
        }
    }    // 초기 프로필 버튼 상태 설정
    updateAuthButton();
    updateMainProfileButton();

    // 프로필 섹션의 로그아웃 버튼 이벤트 리스너 추가
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
        console.log('✅ 프로필 로그아웃 버튼 이벤트 리스너 추가됨');
    }

    // 버튼 상태 디버깅
    console.log('🔍 버튼 상태 확인:');
    console.log('- button1 (채팅):', button1 ? '✅ 발견' : '❌ 없음');
    console.log('- button2 (문서):', button2 ? '✅ 발견' : '❌ 없음');
    console.log('- button3 (로그인):', button3 ? '✅ 발견' : '❌ 없음');
    console.log('- profile:', profile ? '✅ 발견' : '❌ 없음');
    console.log('- loggedInUser:', loggedInUser || '없음');

    // 메시지 표시 함수 (메인 페이지용)
    function showMainMessage(message, type = 'info') {
        const messageBox = document.getElementById('message-box');
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.setAttribute('data-type', type);
            
            // 3초 후 메시지 자동 삭제
            setTimeout(() => {
                messageBox.textContent = '';
                messageBox.removeAttribute('data-type');
            }, 3000);
        }    }    
    
    // 명령 처리: 로그인 성공 시 메인 페이지 처리
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
        console.log('🎯 명령 처리 완료: 로그인 성공 후 메인 페이지 로드됨');
        console.log(`👤 로그인된 사용자: ${loggedInUser}`);
        
        // 메인 페이지에 성공 메시지 표시
        showMainMessage(`🎉 로그인 성공! ${loggedInUser}님 환영합니다!`, 'success');
        
        // 성공 플래그 제거
        localStorage.removeItem('loginSuccess');
        
        console.log('✅ 명령 처리: 프로필 버튼 업데이트 완료');
    }

    // 채팅 기능
    if (chatBox && chatInput && sendButton) {
        console.log('💬 채팅 페이지 감지됨');
        console.log('🔍 현재 로그인 상태:', loggedInUser);
        
        if (!loggedInUser) {
            console.log('❌ 로그인되지 않음 - 채팅 기능 비활성화');
            
            // 로그인되지 않은 경우 경고 메시지 표시 및 기능 비활성화
            chatInput.disabled = true;
            sendButton.disabled = true;
            
            // 경고 메시지 생성 및 표시
            const warningContainer = document.createElement('div');
            warningContainer.className = 'login-warning-container';
            warningContainer.innerHTML = `
                <h3>🔒 로그인이 필요합니다</h3>
                <p>로그인 후 채팅 기능을 사용할 수 있습니다.</p>
                <button onclick="window.location.href='login.html'">로그인하러 가기</button>
            `;
            
            // 채팅 컨테이너 위에 경고 메시지 삽입
            if (chatBox.parentNode) {
                chatBox.parentNode.insertBefore(warningContainer, chatBox);
            }
            
            console.log('⚠️ 채팅 페이지: 로그인 경고 메시지 표시됨');
        } else {
            console.log('✅ 채팅 페이지: 로그인된 사용자 확인됨:', loggedInUser);
            
            chatInput.disabled = false;
            sendButton.disabled = false;
        }

        // Send 버튼 클릭 이벤트 처리
        sendButton.addEventListener('click', async () => {
            const message = chatInput.value.trim(); // 입력된 메시지 가져오기

            if (message && loggedInUser) {
                console.log(`💬 채팅 전송 시도: "${message}" by ${loggedInUser}`);
                
                try {                    
                    // 서버에 채팅 메시지 저장
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            message,
                            author: loggedInUser  // 사용자 정보 추가
                        }),
                    });

                    if (response.ok) {
                        console.log('✅ 채팅 메시지 서버에 저장됨');
                        
                        // 입력란 초기화
                        chatInput.value = '';
                        
                        // 서버에 저장 성공 후 채팅 목록을 다시 로드
                        await loadExistingChats();
                        
                    } else {
                        console.error('❌ 채팅 메시지 저장 실패');
                    }
                } catch (error) {
                    console.error('💥 채팅 메시지 전송 중 오류:', error);
                }
            } else {
                if (!message) console.log('❌ 메시지가 비어있음');
                if (!loggedInUser) console.log('❌ 로그인되지 않음');
            }
        });

        // Enter 키로 메시지 전송 처리 (Shift+Enter는 줄바꿈)
        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault(); // 기본 Enter 동작 방지
                sendButton.click(); // Send 버튼 클릭 이벤트 호출
            }
        });

        // 텍스트 입력 시 높이 자동 조절
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

        // 페이지 로드 시 기존 채팅 메시지 불러오기
        loadExistingChats();
    }

    // 카카오톡 스타일의 채팅 메시지 추가 함수
    function addChatMessage(author, message, timestamp, isOwn = false) {
        const chatBox = document.getElementById('chat-box');
        if (!chatBox) return;

        // author가 undefined이거나 null인 경우 처리
        if (!author) {
            console.error('❌ 채팅 메시지에 작성자 정보가 없습니다:', { author, message, timestamp });
            return; // 메시지를 추가하지 않고 함수 종료
        }

        console.log('💬 채팅 메시지 추가:', { author, message, isOwn });

        // 사용자별 색상 생성 (해시 기반)
        const authorColor = generateUserColor(author);
        
        const messageContainer = document.createElement('div');
        messageContainer.className = `chat-message ${isOwn ? 'current-user' : 'other-user'}`;
        
        const messageTime = new Date(timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // 메시지에서 줄바꿈 처리 (앞뒤 공백 제거)
        const formattedMessage = message.trim().replace(/\n/g, '<br>');

        if (isOwn) {
            // 내 메시지 (오른쪽, 카카오톡 스타일)
            messageContainer.innerHTML = `
                <div class="chat-time">${messageTime}</div>
                <div class="chat-bubble">
                    ${formattedMessage}
                </div>
            `;
        } else {
            // 다른 사람 메시지 (왼쪽, 카카오톡 스타일)
            const isSpecialUser = author === 'CodeNameX0(정승유)👑';
            const nicknameClass = isSpecialUser ? 'chat-nickname special-user' : 'chat-nickname';
            const nicknameStyle = isSpecialUser ? '' : `style="color: ${authorColor}"`;
            
            messageContainer.innerHTML = `
                <div class="${nicknameClass}" ${nicknameStyle} data-username="${author}">${author}</div>
                <div style="display: flex; align-items: flex-end;">
                    <div class="chat-bubble">
                        ${formattedMessage}
                    </div>
                    <div class="chat-time">${messageTime}</div>
                </div>
            `;
        }
        
        chatBox.appendChild(messageContainer);
        
        // 스크롤을 맨 아래로 이동 (약간의 지연을 두어 렌더링 완료 후 실행)
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 10);
    }

    // 사용자별 고유 색상 생성 함수
    function generateUserColor(username) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
            '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
            '#0ABDE3', '#FD79A8', '#6C5CE7', '#A29BFE', '#74B9FF'
        ];
        
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        return colors[Math.abs(hash) % colors.length];
    }

    // 기존 채팅 메시지 불러오기 함수
    async function loadExistingChats() {
        const chatBox = document.getElementById('chat-box');
        if (!chatBox) {
            console.log('❌ 채팅박스를 찾을 수 없습니다');
            return;
        }
        
        if (!loggedInUser) {
            console.log('❌ 로그인된 사용자가 없습니다');
            return;
        }

        try {
            console.log('📡 기존 채팅 메시지 로드 시작...');
            const response = await fetch('/api/chats');
            if (response.ok) {
                const chats = await response.json();
                console.log('📦 서버에서 받은 채팅 데이터:', chats);
                
                chatBox.innerHTML = ''; // 기존 내용 지우기
                
                // author 필드가 있는 메시지만 필터링
                const validChats = chats.filter(chat => {
                    if (!chat.author) {
                        console.warn(`⚠️ author 필드가 없는 메시지 필터링:`, chat);
                        return false;
                    }
                    return true;
                });
                
                console.log(`📊 전체 메시지: ${chats.length}개, 유효한 메시지: ${validChats.length}개`);
                
                validChats.forEach((chat, index) => {
                    console.log(`💬 채팅 ${index + 1}:`, chat);
                    
                    const isOwn = chat.author === loggedInUser;
                    console.log(`👤 채팅 작성자: "${chat.author}", 로그인 사용자: "${loggedInUser}", 내 메시지: ${isOwn}`);
                    
                    addChatMessage(chat.author, chat.message.trim(), chat.timestamp, isOwn);
                });
                
                // 채팅 박스를 맨 아래로 스크롤
                setTimeout(() => {
                    chatBox.scrollTop = chatBox.scrollHeight;
                }, 100);
                
                console.log(`✅ 기존 채팅 ${validChats.length}개 로드 완료`);
            } else {
                console.error('❌ 채팅 로드 실패:', response.status);
            }
        } catch (error) {
            console.error('💥 기존 채팅 로드 중 오류:', error);
        }
    }

    // 채팅 버튼 클릭 시 채팅 창으로 이동
    if (button1) {
        button1.addEventListener('click', () => {
            console.log('💬 채팅 버튼 클릭됨');
            window.location.href = 'chat.html';
        });
    }

    // 게임 버튼 클릭 시 게임 창으로 이동
    if (game) {
        game.addEventListener('click', () => {
            console.log('🎮 게임 버튼 클릭됨');
            window.location.href = 'game.html';
        });
    }

    // 문서 작성 기능
    const documentForm = document.getElementById('document-form'); // 문서 작성 폼
    const loginWarning = document.getElementById('login-warning'); // 로그인 경고 메시지
    const documentMessage = document.getElementById('document-message'); // 문서 저장 메시지
    const savedDocuments = document.getElementById('saved-documents'); // 저장된 문서 영역

    // 문서 페이지 감지 및 로그인 상태 확인
    if (savedDocuments) {
        console.log('📝 문서 페이지 감지됨');
        console.log('🔍 현재 로그인 상태:', loggedInUser);
        
        if (!loggedInUser) {
            console.log('❌ 로그인되지 않음 - 경고 메시지 표시');
            
            // 로그인되지 않은 경우 경고 메시지 표시
            const warningContainer = document.createElement('div');
            warningContainer.className = 'login-warning-container';
            warningContainer.innerHTML = `
                <h3>🔒 로그인이 필요합니다</h3>
                <p>로그인 후 문서 기능을 사용할 수 있습니다.</p>
                <button onclick="window.location.href='login.html'">로그인하러 가기</button>
            `;
            
            // 문서 영역 위에 경고 메시지 삽입
            if (savedDocuments.parentNode) {
                savedDocuments.parentNode.insertBefore(warningContainer, savedDocuments);
            }
            
            // 문서 작성 폼과 검색 기능 숨기기
            if (documentForm) {
                documentForm.style.display = 'none';
            }
            
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.style.display = 'none';
            }
            
            console.log('⚠️ 문서 페이지: 로그인 경고 메시지 표시됨');
        } else {
            console.log('✅ 문서 페이지: 로그인된 사용자 확인됨:', loggedInUser);
            
            // 로그인된 경우 폼과 검색 기능 표시
            if (documentForm) {
                documentForm.style.display = 'block';
            }
            
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer) {
                searchContainer.style.display = 'flex';
            }
        }
    }

    if (documentForm && loginWarning && documentMessage && savedDocuments) {
        if (!loggedInUser) {
            loginWarning.style.display = 'block'; // 로그인 경고 메시지 표시
            documentForm.style.display = 'none'; // 문서 작성 폼 숨기기
        } else {
            loginWarning.style.display = 'none'; // 로그인 경고 메시지 숨기기
            documentForm.style.display = 'block'; // 문서 작성 폼 표시
        }        // 문서 작성 폼 처리
        documentForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const docTitle = document.getElementById('doc-title').value.trim();
            const docContent = document.getElementById('doc-content').value.trim();
            const docFiles = document.getElementById('doc-files').files;
            
            console.log('📝 문서 저장 시도:');
            console.log('- 제목:', docTitle);
            console.log('- 내용:', docContent);
            console.log('- 첨부파일 수:', docFiles.length);
            console.log('- 로그인된 사용자:', loggedInUser);
            
            if (docTitle && docContent && loggedInUser) {
                try {
                    console.log('🌐 서버에 문서 저장 요청 전송...');
                    
                    // FormData를 사용하여 파일과 함께 전송
                    const formData = new FormData();
                    formData.append('title', docTitle);
                    formData.append('content', docContent);
                    formData.append('author', loggedInUser);
                    
                    // 파일 추가
                    for (let i = 0; i < docFiles.length; i++) {
                        formData.append('files', docFiles[i]);
                    }
                    
                    console.log('📦 FormData 준비 완료');
                    
                    // 서버에 문서 저장 (파일 포함)
                    const response = await fetch('/document', {
                        method: 'POST',
                        body: formData // Content-Type 헤더는 자동 설정됨
                    });

                    console.log('📡 서버 응답 상태:', response.status);
                    const result = await response.json();
                    console.log('📦 서버 응답 데이터:', result);
                    
                    if (response.ok) {
                        console.log('✅ 문서 저장 성공!');
                        
                        // 성공 시 로컬 UI 업데이트 (간단한 형태로)
                        const documentElement = document.createElement('div');
                        documentElement.className = 'document-item';
                        documentElement.innerHTML = `
                            <h3 class="document-title">${docTitle}</h3>
                            <p class="document-author"><span class="document-meta-label">작성자:</span> ${loggedInUser} | <span class="document-meta-label">작성일:</span> ${new Date().toLocaleString()}</p>
                            <div class="document-content" style="display: none;">
                                <p>${docContent.replace(/\n/g, '<br>')}</p>
                            </div>
                        `;
                        
                        // 제목 클릭 시 내용 토글
                        const titleElement = documentElement.querySelector('.document-title');
                        const contentElement = documentElement.querySelector('.document-content');
                        titleElement.addEventListener('click', () => {
                            if (contentElement.style.display === 'none') {
                                contentElement.style.display = 'block';
                                documentElement.classList.add('expanded');
                            } else {
                                contentElement.style.display = 'none';
                                documentElement.classList.remove('expanded');
                            }
                        });
                        
                        savedDocuments.appendChild(documentElement);

                        // 입력란 초기화
                        documentForm.reset();
                        documentMessage.textContent = result.message;
                        documentMessage.style.color = 'green';
                        
                        console.log('✅ UI 업데이트 완료');
                    } else {
                        console.error('❌ 문서 저장 실패:', result.message);
                        documentMessage.textContent = result.message;
                        documentMessage.style.color = 'red';
                    }
                } catch (error) {
                    console.error('💥 문서 저장 중 오류:', error);
                    documentMessage.textContent = '문서 저장 중 오류가 발생했습니다.';
                    documentMessage.style.color = 'red';
                }
            } else {
                console.warn('⚠️ 문서 저장 조건 미충족:');
                console.log('- 제목 있음:', !!docTitle);
                console.log('- 내용 있음:', !!docContent);
                console.log('- 로그인됨:', !!loggedInUser);
                
                documentMessage.textContent = '제목, 내용을 모두 입력하고 로그인해주세요.';
                documentMessage.style.color = 'red';
            }
        });
    }

    // 로그아웃 처리
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser'); // 로그인 상태 제거
            alert('로그아웃되었습니다.');
            window.location.reload(); // 페이지 새로고침
        });
    }

    // 계정 폐쇄 처리
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', () => {
            const confirmDelete = confirm('계정을 정말로 폐쇄하시겠습니까?');
            if (confirmDelete) {
                localStorage.removeItem('loggedInUser'); // 로그인 상태 제거
                alert('계정이 폐쇄되었습니다.');
                window.location.reload(); // 페이지 새로고침
            }
        });
    }

    // 외부 사이트 버튼 클릭 시 새 창에서 외부 사이트 열기
    const externalSiteButton = document.getElementById("button4"); // 외부 사이트 버튼

    if (externalSiteButton) {
        console.log('✅ 테트리스 버튼 이벤트 리스너 등록됨');
        externalSiteButton.addEventListener('click', () => {
            console.log('🎮 테트리스 버튼 클릭됨!');
            window.open('https://codenamex0.github.io/Tetris/', '_blank'); // 외부 사이트 URL
        });
    } else {
        console.error('❌ 테트리스 버튼을 찾을 수 없습니다.');
    }

    // 외부 사이트 버튼 클릭 시 새 창에서 외부 사이트 열기
    const externalSiteButton1 = document.getElementById("button5"); // 외부 사이트 버튼

    if (externalSiteButton1) {
        console.log('✅ 룰렛 버튼 이벤트 리스너 등록됨');
        externalSiteButton1.addEventListener('click', () => {
            console.log('🎰 룰렛 버튼 클릭됨!');
            window.open('https://codenamex0.github.io/Roulette/', '_blank'); // 외부 사이트 URL
        });
    } else {
        console.error('❌ 룰렛 버튼을 찾을 수 없습니다.');
    }

    // 외부 사이트 버튼 클릭 시 새 창에서 외부 사이트 열기
    const externalSiteButton2 = document.getElementById("button6"); // 외부 사이트 버튼

    if (externalSiteButton2) {
        console.log('✅ 뱀 개임 버튼 이벤트 리스너 등록됨');
        externalSiteButton2.addEventListener('click', () => {
            console.log('🧱 뱀 게임 버튼 클릭됨!');
            window.open('https://codenamex0.github.io/Snake-Game/', '_blank'); // 외부 사이트 URL
        });
    } else {
        console.error('❌ 벽돌깨기 버튼을 찾을 수 없습니다.');
    }

    // 로그인 버튼 클릭 시 로그인 페이지로 이동 (중복 제거)
    // updateAllLoginButtons에서 처리됨

    // 문서 작성 버튼 클릭 시 문서 작성 페이지로 이동
    if (button2) {
        button2.addEventListener('click', () => {
            console.log('📝 문서 버튼 클릭됨');
            window.location.href = 'document.html';
        });
    } else {
        console.log('❌ 문서 작성 버튼을 찾을 수 없습니다.');
    }    // 로그인 폼 요소 추가
    console.log('🔍 로그인 폼 요소 검색 시작...');
    const loginForm = document.getElementById('login-form');
    console.log('📋 로그인 폼 검색 결과:', loginForm);
    
    if (loginForm) {
        console.log('✅ 로그인 폼 발견됨!');
        console.log('📊 폼 요소 정보:', {
            id: loginForm.id,
            tagName: loginForm.tagName,
            className: loginForm.className
        });
    } else {
        console.error('❌ 로그인 폼을 찾을 수 없습니다!');
        console.log('🔍 페이지의 모든 form 요소들:');
        const allForms = document.querySelectorAll('form');
        console.log('📋 총 form 개수:', allForms.length);
        allForms.forEach((form, index) => {
            console.log(`📝 Form ${index + 1}:`, {
                id: form.id || '(ID 없음)',
                className: form.className || '(클래스 없음)',
                innerHTML: form.innerHTML.substring(0, 100) + '...'
            });
        });
    }
    
    // 비밀번호 표시/숨김 기능
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        console.log('✅ 비밀번호 토글 버튼 찾음');
        passwordToggle.addEventListener('click', (e) => {
            e.preventDefault(); // 폼 제출 방지
            
            if (passwordInput.type === 'password') {
                // 비밀번호 보이기
                passwordInput.type = 'text';
                passwordToggle.textContent = '🙈'; // 눈 감은 이모지
                console.log('👁️ 비밀번호 표시됨');
            } else {
                // 비밀번호 숨기기
                passwordInput.type = 'password';
                passwordToggle.textContent = '👁️'; // 눈 뜬 이모지
                console.log('🙈 비밀번호 숨겨짐');
            }
        });
    } else {
        if (!passwordToggle) console.log('❌ 비밀번호 토글 버튼을 찾을 수 없음');
        if (!passwordInput) console.log('❌ 비밀번호 입력란을 찾을 수 없음');
    }
    
    // 페이지 로드 시 디버깅 정보
    console.log('🔍 페이지 로드 디버깅 정보:');
    console.log('- 현재 URL:', window.location.href);
    console.log('- 로그인 폼 존재:', loginForm ? '✅' : '❌');
    console.log('- username 입력란:', document.getElementById('username') ? '✅' : '❌');
    console.log('- password 입력란:', document.getElementById('password') ? '✅' : '❌');
    console.log('- message-box 존재:', document.getElementById('message-box') ? '✅' : '❌');

    // 메시지 표시 함수 (로그인 페이지용)
    function showMessage(message, type = 'info', autoHide = true) {
        const messageBox = document.getElementById('message-box');
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.setAttribute('data-type', type);
            
            // autoHide가 true일 때만 자동으로 메시지 삭제
            if (autoHide) {
                setTimeout(() => {
                    messageBox.textContent = '';
                    messageBox.removeAttribute('data-type');
                }, 3000);
            }
        }
    }    // 로그인 처리
    console.log('🔄 로그인 처리 섹션 시작...');
    console.log('📋 loginForm 존재 여부:', !!loginForm);
    
    if (loginForm) {
        console.log('✅ 로그인 폼 감지됨 - 이벤트 리스너 등록 중...');
        
        // 로그인 버튼에 직접 클릭 이벤트도 추가
        const loginButton = document.getElementById('button3');
        if (loginButton) {
            console.log('🔘 로그인 버튼 발견됨 - 직접 클릭 이벤트 추가');
            loginButton.addEventListener('click', (event) => {
                console.log('🚨 로그인 버튼 직접 클릭됨!');
                // submit 이벤트가 발생하도록 유도
                if (loginForm) {
                    console.log('📝 폼 제출 이벤트 수동 발생');
                    loginForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
            });
        }
        
        loginForm.addEventListener('submit', async (event) => {
            console.log('🚨 로그인 폼 제출 이벤트 발생!');
            event.preventDefault();
            console.log('🔄 로그인 폼 제출 시작');

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            
            console.log('📋 입력 요소 확인:');
            console.log('- username 입력란:', usernameInput);
            console.log('- password 입력란:', passwordInput);
            
            if (!usernameInput || !passwordInput) {
                console.error('❌ 필수 입력 요소를 찾을 수 없습니다!');
                return;
            }

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            console.log(`📝 입력된 사용자명: "${username}"`);
            console.log(`📝 입력된 비밀번호 길이: ${password.length}`);

            try {
                console.log('🌐 서버에 로그인 요청 전송 중...');
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                console.log(`📡 서버 응답 상태: ${response.status}`);
                const result = await response.json();
                console.log('📦 서버 응답 데이터:', result);
                console.log('🔍 redirect 필드 확인:', result.redirect);
                console.log('🔍 redirect 필드 타입:', typeof result.redirect);
                console.log('🔍 redirect 존재 여부:', !!result.redirect);                if (response.ok) {
                    // 터미널에 명확한 성공 메시지 출력
                    console.log(`🎉 로그인 성공: ${result.username}`);
                    
                    // 로그인 정보 저장
                    loggedInUser = result.username;
                    localStorage.setItem('loggedInUser', loggedInUser);
                    localStorage.setItem('loginSuccess', 'true');
                    console.log('💾 로그인 정보 localStorage에 저장됨');
                    
                    // 모든 페이지의 버튼 상태 업데이트
                    updateAuthButton();
                    updateMainProfileButton();
                    
                    // 모든 사용자는 메인 페이지로 이동
                    showMessage('✅ 로그인 성공! 잠시 후 메인 페이지로 이동합니다...', 'success', false);
                    
                    // 2.5초 후 메시지 업데이트
                    setTimeout(() => {
                        showMessage('🚀 메인 페이지로 이동 중...', 'info', false);
                    }, 2500);
                    
                    // 3초 후 메인 페이지로 이동
                    setTimeout(() => {
                        console.log('🚀 명령 처리: window.open으로 새 창 열기');
                        window.open('/index.html', '_blank');
                    }, 3000);
                    
                } else {
                    // 로그인 실패 시 명확한 메시지 표시
                    console.log(`❌ 로그인 실패: ${result.message}`);
                    showMessage(`❌ 로그인 실패: ${result.message || '아이디 또는 비밀번호를 확인해주세요.'}`, 'error');
                    
                    // 입력 필드 초기화 (보안상)
                    document.getElementById('password').value = '';
                }
            } catch (error) {
                console.error('💥 로그인 중 오류 발생:', error);
                showMessage('로그인 중 문제가 발생했습니다.', 'error');
            }
        });
        
        console.log('✅ 로그인 폼 이벤트 리스너 등록 완료!');
    } else {
        console.log('❌ 로그인 폼을 찾을 수 없습니다!');
        console.log('🔍 현재 페이지가 로그인 페이지인지 확인해주세요.');
    }

    // 초기 상태 확인 및 프로필 버튼 업데이트
    updateMainProfileButton();

    // 사용자 등록 폼 처리
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value.trim();

            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert('사용자 등록 성공!');
                    registerForm.reset();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('사용자 등록 중 오류 발생:', error);
                alert('사용자 등록 중 문제가 발생했습니다.');
            }        });
    }

    // 메시지 표시 함수
    function showMessage(message, color = 'black') {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.style.color = color;
        }
    }

    // 문서 작성 처리
    if (documentForm) {
        documentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const title = document.getElementById('doc-title').value.trim();
            const content = document.getElementById('doc-content').value.trim();

            try {
                const response = await fetch('/document', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, content }),
                });

                const result = await response.json();

                if (response.ok) {
                    showMessage(result.message, 'green');
                    loadDocuments(); // 문서 목록 새로고침
                } else {
                    showMessage(result.message, 'red');
                }
            } catch (error) {
                console.error('문서 저장 중 오류 발생:', error);
                showMessage('문서 저장 중 문제가 발생했습니다.', 'red');
            }
        });

        // 서버에서 저장된 문서 가져오기
        async function loadDocuments() {
            console.log('📋 문서 목록 로드 시작...');
            
            // 로그인 상태 재확인
            const currentUser = localStorage.getItem('loggedInUser');
            console.log('🔍 로그인 상태 재확인:', currentUser);
            
            try {
                const response = await fetch('/api/documents');
                console.log('📡 서버 응답 상태:', response.status);
                
                const documents = await response.json();
                console.log('📦 서버에서 받은 문서 데이터:', documents);
                console.log('📊 총 문서 수:', documents.length);

                savedDocuments.innerHTML = ''; // 기존 문서 목록 초기화
                
                if (documents.length === 0) {
                    console.log('📝 저장된 문서가 없습니다.');
                    savedDocuments.innerHTML = '<p style="color: #666; text-align: center;">저장된 문서가 없습니다.</p>';
                    return;
                }
                
                documents.forEach((doc, index) => {
                    console.log(`📄 문서 ${index + 1} 처리 중:`, doc.title);
                    const documentElement = document.createElement('div');
                    documentElement.className = 'document-item';
                    
                    // 기본적으로는 제목만 표시
                    const actionButtons = '';
                    
                    console.log(`📝 문서 "${doc.title}": 작성자=${doc.author}, 현재사용자=${currentUser}, 수정가능=${doc.author === currentUser}`);
                    
                    // 특별한 사용자인지 확인
                    const isSpecialAuthor = doc.author === 'CodeNameX0(정승유)👑';
                    const authorClass = isSpecialAuthor ? 'document-author special-user' : 'document-author';
                    
                    documentElement.innerHTML = `
                        <h3 class="document-title" data-doc-id="${doc.id}">
                            ${doc.title}
                        </h3>
                        <p class="document-author">
                            <span class="document-meta-label">작성자:</span> <span class="${authorClass}" data-author="${doc.author}">${doc.author}</span> | <span class="document-meta-label">작성일:</span> ${new Date(doc.createdAt).toLocaleString()}
                        </p>
                        ${actionButtons}
                        <div class="document-content" style="display: none;">
                            <p>${doc.content.replace(/\n/g, '<br>')}</p>
                            ${doc.comments.length > 0 ? `
                                <div class="comments-section">
                                    <h4>댓글 (${doc.comments.length}개)</h4>
                                    ${doc.comments.map((comment, commentIndex) => {
                                        const isSpecialCommentAuthor = comment.author === 'CodeNameX0(정승유)👑';
                                        const commentAuthorClass = isSpecialCommentAuthor ? 'comment-author special-user' : 'comment-author';
                                        
                                        return `<div class="comment">
                                            <div class="${commentAuthorClass}" data-author="${comment.author}">${comment.author}</div>
                                            <div class="comment-text">${comment.content}</div>
                                            <small style="color: #888; font-size: 0.75rem;">${new Date(comment.createdAt).toLocaleString()}</small>
                                        </div>`;
                                    }).join('')}
                                </div>
                            ` : ''}
                            ${currentUser ? `
                                <form class="comment-form" data-doc-id="${doc.id}" style="margin-top: 1rem;">
                                    <div style="display: flex; gap: 0.5rem;">
                                        <input type="text" class="comment-input" placeholder="댓글을 입력하세요..." required style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; min-height: 48px; box-sizing: border-box; -webkit-appearance: none; appearance: none;" autocomplete="off" autocorrect="off">
                                        <button type="submit" class="comment-submit" style="padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; min-height: 48px;">댓글</button>
                                    </div>
                                </form>
                            ` : '<p style="color: #888; font-style: italic; font-size: 0.85rem;">댓글을 작성하려면 로그인하세요.</p>'}
                        </div>
                    `;
                    
                    // 제목 클릭 시 내용 토글
                    const titleElement = documentElement.querySelector('.document-title');
                    const contentElement = documentElement.querySelector('.document-content');
                    
                    titleElement.addEventListener('click', () => {
                        if (contentElement.style.display === 'none') {
                            contentElement.style.display = 'block';
                            documentElement.classList.add('expanded');
                        } else {
                            contentElement.style.display = 'none';
                            documentElement.classList.remove('expanded');
                        }
                    });
                    
                    // 댓글 폼 이벤트 리스너 추가
                    const commentForm = documentElement.querySelector('.comment-form');
                    if (commentForm) {
                        commentForm.addEventListener('submit', async (event) => {
                            event.preventDefault();
                            const commentInput = commentForm.querySelector('input');
                            const commentContent = commentInput.value.trim();
                            
                            if (commentContent && currentUser) {
                                try {
                                    const response = await fetch('/document/comment', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ 
                                            documentId: doc.id, 
                                            content: commentContent,
                                            author: currentUser
                                        }),
                                    });

                                    if (response.ok) {
                                        commentInput.value = '';
                                        
                                        // 댓글 추가 메시지 표시
                                        showDocumentMessage('✅ 댓글이 추가되었습니다!', 'success');
                                        
                                        // 페이지 새로고침 대신 문서 목록만 업데이트
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 1000);
                                        
                                        console.log('💬 댓글이 저장되었습니다');
                                    } else {
                                        const result = await response.json();
                                        console.error('댓글 저장 실패:', result.message);
                                        showDocumentMessage('❌ 댓글 저장에 실패했습니다.', 'error');
                                    }
                                } catch (error) {
                                    console.error('댓글 저장 중 오류:', error);
                                    showDocumentMessage('❌ 댓글 저장 중 오류가 발생했습니다.', 'error');
                                }
                            }
                        });
                    }

                    savedDocuments.appendChild(documentElement);
                });
                
                console.log('✅ 문서 목록 UI 생성 완료');
            } catch (error) {
                console.error('💥 문서 로드 중 오류 발생:', error);
                savedDocuments.innerHTML = '<p style="color: red; text-align: center;">문서를 불러오는 중 오류가 발생했습니다.</p>';
            }
        }

        console.log('🚀 페이지 로드 시 문서 목록 로드 시작');
        loadDocuments();
    }

    // 검색 기능 구현
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const clearSearchButton = document.getElementById('clear-search');

    if (searchInput && searchButton && clearSearchButton) {
        console.log('🔍 검색 기능 초기화 중...');
        
        // 검색 실행 함수
        async function performSearch(query) {
            if (!query.trim()) {
                loadDocuments(); // 빈 검색어면 전체 문서 표시
                return;
            }
            
            try {
                console.log('🔍 검색 실행:', query);
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                
                if (response.ok) {
                    const results = await response.json();
                    console.log('📊 검색 결과:', results.length, '개');
                    displaySearchResults(results, query);
                } else {
                    console.error('검색 실패:', response.status);
                    showDocumentMessage('❌ 검색 중 오류가 발생했습니다.', 'error');
                }
            } catch (error) {
                console.error('검색 오류:', error);
                showDocumentMessage('❌ 검색 중 오류가 발생했습니다.', 'error');
            }
        }
        
        // 검색 결과 표시 함수
        function displaySearchResults(results, query) {
            if (!savedDocuments) return;
            
            savedDocuments.innerHTML = '';
            
            if (results.length === 0) {
                savedDocuments.innerHTML = `
                    <div style="text-align: center; color: #888; padding: 2rem;">
                        <h3>검색 결과가 없습니다</h3>
                        <p>"${query}"에 대한 검색 결과를 찾을 수 없습니다.</p>
                    </div>
                `;
                return;
            }
            
            // 검색 결과 헤더
            const resultHeader = document.createElement('div');
            resultHeader.innerHTML = `
                <h3 style="color: var(--accent-color); margin-bottom: 1rem;">
                    🔍 "${query}" 검색 결과: ${results.length}개
                </h3>
            `;
            savedDocuments.appendChild(resultHeader);
            
            // 검색어 하이라이트 함수
            function highlightText(text, query) {
                const regex = new RegExp(`(${query})`, 'gi');
                return text.replace(regex, '<span class="search-highlight">$1</span>');
            }
            
            // 검색 결과 표시 (간단한 양식으로)
            results.forEach((doc, index) => {
                const documentElement = document.createElement('div');
                documentElement.className = 'document-item';
                
                const isSpecialAuthor = doc.author === 'CodeNameX0(정승유)👑';
                const authorClass = isSpecialAuthor ? 'document-author special-user' : 'document-author';
                
                documentElement.innerHTML = `
                    <h3 class="document-title" data-doc-id="${doc.id}">
                        ${highlightText(doc.title, query)}
                    </h3>
                    <p class="document-author">
                        <span class="document-meta-label">작성자:</span> <span class="${authorClass}" data-author="${doc.author}">${doc.author}</span> | <span class="document-meta-label">작성일:</span> ${new Date(doc.createdAt).toLocaleString()}
                    </p>
                    <div class="document-content" style="display: none;">
                        <p>${highlightText(doc.content.replace(/\n/g, '<br>'), query)}</p>
                    </div>
                `;
                
                // 클릭 이벤트 추가
                const titleElement = documentElement.querySelector('.document-title');
                titleElement.addEventListener('click', () => {
                    const contentElement = documentElement.querySelector('.document-content');
                    if (contentElement.style.display === 'none') {
                        contentElement.style.display = 'block';
                        documentElement.classList.add('expanded');
                    } else {
                        contentElement.style.display = 'none';
                        documentElement.classList.remove('expanded');
                    }
                });
                
                savedDocuments.appendChild(documentElement);
            });
        }
        
        // 검색 버튼 클릭 이벤트
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });
        
        // 엔터 키 검색
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // 전체보기 버튼
        clearSearchButton.addEventListener('click', () => {
            searchInput.value = '';
            loadDocuments();
        });
        
        console.log('✅ 검색 기능 초기화 완료');
    }

    // ================================
    // 테마 관리 시스템
    // ================================
    
    // 테마 토글 버튼 생성 및 추가
    function createThemeToggle() {
        console.log('🎨 테마 토글 버튼 생성 중...');
        
        // 기존 토글 버튼이 있으면 제거
        const existingToggle = document.querySelector('.theme-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }
        
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', '테마 전환');
        themeToggle.setAttribute('title', '다크/라이트 모드 전환');
        
        // 현재 테마에 따라 버튼 텍스트 설정
        const currentTheme = getCurrentTheme();
        updateThemeToggleButton(themeToggle, currentTheme);
        
        // 클릭 이벤트 추가
        themeToggle.addEventListener('click', toggleTheme);
        
        // body에 추가
        document.body.appendChild(themeToggle);
        
        console.log('✅ 테마 토글 버튼 생성 완료');
    }
    
    // 현재 테마 가져오기
    function getCurrentTheme() {
        // localStorage에서 저장된 테마 확인
        const savedTheme = localStorage.getItem('chatcoder-theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // 시스템 다크 모드 설정 확인
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        
        // 기본값은 다크 모드
        return 'dark';
    }
    
    // 테마 적용하기
    function applyTheme(theme) {
        console.log(`🎨 테마 적용 중: ${theme}`);
        
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        
        // localStorage에 테마 저장
        localStorage.setItem('chatcoder-theme', theme);
        
        // 토글 버튼 업데이트
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            updateThemeToggleButton(themeToggle, theme);
        }
        
        console.log(`✅ ${theme} 모드 적용 완료`);
    }
    
    // 테마 토글 버튼 텍스트 업데이트
    function updateThemeToggleButton(button, theme) {
        if (theme === 'light') {
            button.innerHTML = '<span class="icon">🌙</span><span>다크 모드</span>';
        } else {
            button.innerHTML = '<span class="icon">☀️</span><span>라이트 모드</span>';
        }
    }
    
    // 테마 전환하기
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        console.log(`🔄 테마 전환: ${currentTheme} → ${newTheme}`);
        applyTheme(newTheme);
        
        // 부드러운 전환 효과를 위한 애니메이션
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    // 시스템 테마 변경 감지
    function watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // 사용자가 수동으로 설정한 테마가 없을 때만 시스템 테마를 따름
                const savedTheme = localStorage.getItem('chatcoder-theme');
                if (!savedTheme) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    console.log(`🔄 시스템 테마 변경 감지: ${newTheme}`);
                    applyTheme(newTheme);
                }
            });
        }
    }
    
    // 테마 시스템 초기화
    function initializeTheme() {
        console.log('🎨 테마 시스템 초기화 중...');
        
        // 현재 테마 적용
        const currentTheme = getCurrentTheme();
        applyTheme(currentTheme);
        
        // 토글 버튼 생성
        createThemeToggle();
        
        // 시스템 테마 변경 감지 시작
        watchSystemTheme();
        
        console.log('✅ 테마 시스템 초기화 완료');
    }
    
    // 페이지 로드 시 테마 초기화
    initializeTheme();
});