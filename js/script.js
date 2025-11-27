// Vận hành tất cả các script sau khi DOM đã tải hoàn toàn
document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------
    // BÀI TẬP 1: IMAGE CAROUSEL (Chỉ chạy trên baitap01.html)
    // -------------------------------------------------------------------
    const track = document.getElementById('carousel-track');
    if (track) {
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const slides = document.querySelectorAll('.slide');

        let currentIndex = 0;
        const numSlides = slides.length;
        let autoSlideInterval;

        function updateCarousel() {
            const offset = -currentIndex * 100;
            track.style.transform = `translateX(${offset}%)`;
        }

        function nextSlide() {
            // Logic Modulo: Đảm bảo index luôn quay về 0 khi chạm cuối
            currentIndex = (currentIndex + 1) % numSlides;
            updateCarousel();
        }

        function prevSlide() {
            // Logic Modulo an toàn cho số âm: (index - 1 + tổng số) % tổng số
            currentIndex = (currentIndex - 1 + numSlides) % numSlides;
            updateCarousel();
        }

        function startAutoSlide() {
            clearInterval(autoSlideInterval); 
            autoSlideInterval = setInterval(nextSlide, 3000); // 3 giây
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); // Reset interval
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide(); // Reset interval
        });

        startAutoSlide(); 
        console.log("Carousel Script Loaded.");
    }

    // -------------------------------------------------------------------
    // BÀI TẬP 2: TODO LIST (Chỉ chạy trên baitap02.html)
    // -------------------------------------------------------------------
    const todoListContainer = document.getElementById('todo-list');
    if (todoListContainer) {
        const taskInput = document.getElementById('task-input');
        const addBtn = document.getElementById('add-btn');
        let todos = [];

        function loadTodos() {
            try {
                const storedTodos = localStorage.getItem('todos');
                todos = storedTodos ? JSON.parse(storedTodos) : [];
            } catch (e) {
                console.error("Lỗi khi tải LocalStorage:", e);
                todos = [];
            }
        }

        function saveTodos() {
            try {
                localStorage.setItem('todos', JSON.stringify(todos));
            } catch (e) {
                console.error("Lỗi khi lưu LocalStorage:", e);
            }
        }

        function saveAndRender() {
            saveTodos();
            renderTodos();
        }
        
        function addTask() {
            const text = taskInput.value.trim();
            if (!text) return;

            const newTodo = {
                id: crypto.randomUUID(), // ID duy nhất
                text: text,
                isCompleted: false
            };

            todos.push(newTodo);
            taskInput.value = '';
            saveAndRender();
        }

        function deleteTask(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveAndRender();
        }

        function updateTaskText(id, newText) {
            const text = newText.trim();
            if (!text) {
                 deleteTask(id);
                 return;
            }

            const todoToUpdate = todos.find(todo => todo.id === id);
            if (todoToUpdate) {
                todoToUpdate.text = text;
                saveAndRender();
            }
        }
        
        function toggleComplete(id) {
            const todoToUpdate = todos.find(todo => todo.id === id);
            if (todoToUpdate) {
                todoToUpdate.isCompleted = !todoToUpdate.isCompleted;
                saveAndRender();
            }
        }
        
        function renderTodos() {
            todoListContainer.innerHTML = ''; 

            if (todos.length === 0) {
                todoListContainer.innerHTML = '<p class="text-center text-gray-500 py-4">Chưa có công việc nào.</p>';
                return;
            }

            todos.forEach(todo => {
                const item = document.createElement('div');
                item.className = 'todo-item';
                item.dataset.id = todo.id;

                const textElement = document.createElement('span');
                textElement.className = `task-text ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`;
                textElement.textContent = todo.text;
                textElement.addEventListener('click', () => toggleComplete(todo.id));

                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-edit text-sm bg-blue-500 text-white hover:bg-blue-600';
                editBtn.textContent = 'Sửa';
                editBtn.addEventListener('click', () => {
                    const currentText = textElement.textContent;
                    const inputEdit = document.createElement('input');
                    inputEdit.type = 'text';
                    inputEdit.className = 'p-1 border border-blue-400 rounded-md flex-grow';
                    inputEdit.value = currentText;

                    item.replaceChild(inputEdit, textElement);
                    inputEdit.focus();

                    const finishEdit = () => {
                        updateTaskText(todo.id, inputEdit.value);
                    };

                    inputEdit.addEventListener('blur', finishEdit);
                    inputEdit.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            finishEdit();
                        }
                    });
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-delete text-sm bg-red-500 text-white hover:bg-red-600';
                deleteBtn.textContent = 'Xóa';
                deleteBtn.addEventListener('click', () => deleteTask(todo.id));
                
                item.appendChild(textElement);
                item.appendChild(editBtn);
                item.appendChild(deleteBtn);
                todoListContainer.appendChild(item);
            });
        }

        addBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        loadTodos();
        renderTodos();
        console.log("Todo List Script Loaded.");
    }
    
    // -------------------------------------------------------------------
    // BÀI TẬP 3: GUESSING GAME (Chỉ chạy trên baitap03.html)
    // -------------------------------------------------------------------
    const guessInput = document.getElementById('guess-input');
    if (guessInput) {
        const guessBtn = document.getElementById('guess-btn');
        const resetBtn = document.getElementById('reset-btn');
        const message = document.getElementById('message');
        const attemptsDisplay = document.getElementById('attempts');
        const body = document.body;

        let targetNumber;
        let attempts;
        let isGameOver = false;

        function resetGame() {
            targetNumber = Math.floor(Math.random() * 100) + 1;
            attempts = 0;
            isGameOver = false;
            
            message.textContent = 'Hãy bắt đầu đoán!';
            attemptsDisplay.textContent = 'Số lần thử: 0';
            guessInput.value = '';
            guessInput.disabled = false;
            guessBtn.disabled = false;
            resetBtn.classList.add('hidden');
            
            body.classList.remove('confetti-active');
            console.log("Game đã được reset. Số mục tiêu mới: " + targetNumber);
        }

        function checkGuess() {
            if (isGameOver) return;

            const guess = parseInt(guessInput.value);

            if (isNaN(guess) || guess < 1 || guess > 100) {
                message.textContent = 'Lỗi! Vui lòng nhập một số hợp lệ từ 1 đến 100.';
                message.className = 'mt-5 text-xl font-bold text-red-600 min-h-6';
                return;
            }

            attempts++;
            attemptsDisplay.textContent = 'Số lần thử: ' + attempts;
            
            message.className = 'mt-5 text-xl font-bold min-h-6'; 

            if (guess === targetNumber) {
                message.textContent = `CHÚC MỪNG! Bạn đã đoán đúng số ${targetNumber} chỉ sau ${attempts} lần thử!`;
                message.className = 'mt-5 text-xl font-black text-green-600 min-h-6';
                
                isGameOver = true;
                guessInput.disabled = true;
                guessBtn.disabled = true;
                resetBtn.classList.remove('hidden');

                body.classList.add('confetti-active');

            } else if (guess < targetNumber) {
                message.textContent = 'Quá thấp! Thử lại.';
                message.className = 'mt-5 text-xl font-bold text-yellow-600 min-h-6';
            } else {
                message.textContent = 'Quá cao! Thử lại.';
                message.className = 'mt-5 text-xl font-bold text-red-600 min-h-6';
            }
            
            guessInput.value = '';
            guessInput.focus();
        }

        guessBtn.addEventListener('click', checkGuess);
        resetBtn.addEventListener('click', resetGame);
        
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkGuess();
            }
        });

        resetGame();
        console.log("Guessing Game Script Loaded.");
    }
});