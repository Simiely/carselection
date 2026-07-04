// ================================================================
// CarQuestionnaireApp - 核心应用逻辑
// ================================================================

const CarQuestionnaireApp = {
        data: {
            questions: window.QUESTIONNAIRE_DATA,
            userSelections: {},
            cache: {}
        },

        render: {
            generateQuestionnaire: function() {
                this.renderCategoryNav();
                this.renderQuestionNav(1);
                this.renderPage(1);
            },

            // 定义事件处理函数
            categoryNavClickHandler: function(e) {
                const btn = e.target.closest('.category-nav-btn');
                if (btn) {
                    const categoryId = btn.dataset.category;
                    const category = mainCategories.find(c => c.id === categoryId);
                    if (category && category.questionIds.length > 0) {
                        CarQuestionnaireApp.render.renderCategoryNav(categoryId);
                        CarQuestionnaireApp.render.renderQuestionNav(category.questionIds[0]);
                        CarQuestionnaireApp.render.renderPage(category.questionIds[0]);
                    }
                }
            },

            renderCategoryNav: function(activeCategoryId) {
                const categoryNav = document.getElementById('category-nav');
                let html = '';
                mainCategories.forEach((cat, index) => {
                    const isActive = activeCategoryId === cat.id || (activeCategoryId === undefined && index === 0);
                    // 提取分类文字（去除编号）
                    const categoryText = cat.id.replace(/^[一二三四五六七八九十]+、/, '');
                    // 激活时显示emoji+文字，非激活时只显示emoji
                    const buttonContent = isActive ? `${cat.name} ${categoryText}` : cat.name;
                    // 为分类按钮添加title属性，显示完整分类名称
                    html += `<button class="category-nav-btn ${isActive ? 'active' : ''}" data-category="${cat.id}" title="${cat.id}">${buttonContent}</button>`;
                });
                categoryNav.innerHTML = html;

                // 移除旧的事件监听器
                categoryNav.removeEventListener('click', CarQuestionnaireApp.render.categoryNavClickHandler);
                // 添加新的事件监听器
                categoryNav.addEventListener('click', CarQuestionnaireApp.render.categoryNavClickHandler);
            },

            // 定义事件处理函数
            questionNavClickHandler: function(e) {
                const btn = e.target.closest('.question-nav-btn');
                if (btn) {
                    const questionId = parseInt(btn.dataset.question);
                    CarQuestionnaireApp.render.renderQuestionNav(questionId);
                    CarQuestionnaireApp.render.renderPage(questionId);
                }
            },

            renderQuestionNav: function(currentQuestionId) {
                const questionNav = document.getElementById('question-nav');
                const category = mainCategories.find(cat => cat.questionIds.includes(currentQuestionId));
                if (!category) return;

                // 更新分类导航的激活状态
                CarQuestionnaireApp.render.renderCategoryNav(category.id);

                // 题目emoji映射
                const questionEmojis = {
                    1: '💰', 2: '🔋', 3: '📊', 4: '🚗', 5: '👥', 6: '🏷️', 7: '🔑',
                    8: '🎨', 9: '🌈', 10: '🔍', 11: '📏', 12: '🎪',
                    13: '🛋️', 14: '🧵', 15: '🎭', 16: '📦', 17: '🌬️',
                    18: '⚡', 19: '💪', 20: '🏎️', 21: '🚄', 22: '📈',
                    23: '🚘', 24: '⚙️', 25: '🔄', 26: '🛞', 27: '🎮', 28: '🔇', 29: '👣',
                    30: '🎯', 31: '⚖️', 32: '🏁', 33: '🔄', 34: '🚅', 35: '🛠️',
                    36: '📏', 37: '🧍', 38: '📦', 39: '🔧', 40: '👁️',
                    41: '🔩', 42: '📯', 43: '💺', 44: '🚪', 45: '👶',
                    46: '⭐', 47: '🛡️', 48: '🛑', 49: '🤖', 50: '💡',
                    51: '📱', 52: '🎵', 53: '🗺️', 54: '📲', 55: '📟', 56: '📊', 57: '👁️',
                    58: '🪑', 59: '❄️', 60: '🎶', 61: '✨', 62: '🔇',
                    63: '⛽', 64: '⚡', 65: '💰', 66: '📈',
                    67: '💸', 68: '📝', 69: '🔧', 70: '🛡️', 71: '⏱️',
                    72: '🌿', 73: '🔋', 74: '🌍', 75: '♻️',
                    76: '🏷️', 77: '🏢', 78: '🌎', 79: '🌟', 80: '🎨',
                    81: '📊', 82: '⭐', 83: '⚠️', 84: '📦', 85: '🛠️',
                    86: '📝', 87: '🔧', 88: '🔩', 89: '⏱️', 90: '👨‍🔧',
                    91: '🛣️', 92: '🌤️', 93: '🏔️', 94: '🚧',
                    95: '💼', 96: '👨‍👩‍👧‍👦', 97: '🏞️', 98: '🚙', 99: '✨',
                    100: '🤖', 101: '🚀', 102: '🛡️', 103: '💰',
                    104: '📱', 105: '🎤', 106: '🎨', 107: '📟',
                    108: '💳', 109: '💸', 110: '📅', 111: '⚡',
                    112: '📅', 113: '💰', 114: '📦', 115: '✨', 116: '🛒'
                };

                let html = '';
                category.questionIds.forEach((qId, index) => {
                    if (index > 0) {
                        html += '<span class="question-nav-separator"></span>';
                    }
                    const question = CarQuestionnaireApp.data.questions.find(q => q.id === qId);
                    if (question) {
                        const isActive = qId === currentQuestionId;
                        const hasSelection = question.options.some(opt => CarQuestionnaireApp.data.userSelections[opt.id] === true);
                        const emoji = questionEmojis[qId] || '📝';
                        // 提取题目文字（去除编号）
                        const questionText = question.title.replace(/^\d+\.\s*/, '');
                        // 激活时显示emoji+文字，非激活时只显示emoji
                        const buttonContent = isActive ? `${emoji} ${questionText}` : emoji;
                        html += `<button class="question-nav-btn ${isActive ? 'active' : ''} ${hasSelection ? 'has-selection' : ''}" data-question="${qId}" title="${question.title}">${buttonContent}</button>`;
                    }
                });
                questionNav.innerHTML = html;

                // 移除旧的事件监听器
                questionNav.removeEventListener('click', CarQuestionnaireApp.render.questionNavClickHandler);
                // 添加新的事件监听器
                questionNav.addEventListener('click', CarQuestionnaireApp.render.questionNavClickHandler);
            },

            renderPage: function(questionId) {
                const pagesContainer = document.getElementById('pages-container');
                const question = CarQuestionnaireApp.data.questions.find(q => q.id === questionId);

                if (!question) return;

                const cacheKey = `page-${questionId}`;
                let pageHTML = CarQuestionnaireApp.data.cache[cacheKey];

                if (!pageHTML) {
                    pageHTML = this.generatePageHTML(questionId, question);
                    CarQuestionnaireApp.data.cache[cacheKey] = pageHTML;
                } else {
                    pageHTML = this.updateCachedPageHTML(pageHTML, question);
                }

                pagesContainer.innerHTML = pageHTML;
                this.initializePageEventListeners();
                // 更新固定导航按钮状态
                console.log('renderPage called with questionId:', questionId);
                try {
                    console.log('Calling updateFixedNavButtons...');
                    CarQuestionnaireApp.updateFixedNavButtons(questionId);
                } catch (error) {
                    console.error('Error calling updateFixedNavButtons:', error);
                }
            },

            generatePageHTML: function(questionId, question) {
                const category = questionCategories[question.id];
                let categoryTagsHTML = '';
                if (category) {
                    categoryTagsHTML = `
                        <div class="category-tags">
                            <span class="category-tag main">${category.main}</span>
                            <span class="category-tag sub">${category.sub}</span>
                        </div>
                    `;
                }
                let pageHTML = `
                    <div class="page active" id="page-${questionId}">
                        <div class="option-group">
                            <div class="option-group-title">
                                <span>${question.title}</span>
                                ${categoryTagsHTML}
                            </div>
                `;

                question.options.forEach(option => {
                    const isSelected = CarQuestionnaireApp.data.userSelections[option.id] === true;
                    pageHTML += `
                        <div class="option">
                            <div class="option-header">
                                <input type="checkbox" id="${option.id}" ${isSelected ? 'checked' : ''}>
                                <label for="${option.id}">${option.label}</label>
                                <span class="toggle-icon ${isSelected ? 'active' : ''}">▼</span>
                            </div>
                            <div class="option-details ${isSelected ? 'active' : ''}">
                                <strong>核心判断依据：</strong>
                                <ul>
                    `;

                    option.details.forEach(detail => {
                        pageHTML += `<li>${detail}</li>`;
                    });

                    pageHTML += `
                                </ul>
                            </div>
                        </div>
                    `;
                });

                pageHTML += `</div>`;

                return pageHTML;
            },

            updateCachedPageHTML: function(pageHTML, question) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = pageHTML;

                const checkboxes = tempDiv.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    const optionId = checkbox.id;
                    const isSelected = CarQuestionnaireApp.data.userSelections[optionId] === true;
                    checkbox.checked = isSelected;

                    const option = checkbox.closest('.option');
                    const details = option.querySelector('.option-details');
                    const toggleIcon = option.querySelector('.toggle-icon');

                    if (isSelected) {
                        details.classList.add('active');
                        toggleIcon.classList.add('active');
                    } else {
                        details.classList.remove('active');
                        toggleIcon.classList.remove('active');
                    }
                });

                const updatedHTML = tempDiv.innerHTML;
                // 统一使用questionId作为缓存键，与generatePageHTML保持一致
                const cacheKey = `page-${question.id}`;
                CarQuestionnaireApp.data.cache[cacheKey] = updatedHTML;

                return updatedHTML;
            },

            initializePageEventListeners: function() {
                const options = document.querySelectorAll('.option');

                options.forEach(option => {
                    const header = option.querySelector('.option-header');
                    const checkbox = header.querySelector('input[type="checkbox"]');
                    const details = header.nextElementSibling;
                    const toggleIcon = header.querySelector('.toggle-icon');

                    const annotateKeywords = function() {
                        const optionId = checkbox.id;
                        const option = CarQuestionnaireApp.data.questions.flatMap(q => q.options).find(opt => opt.id === optionId);
                        if (option) {
                            const detailItems = details.querySelectorAll('li');
                            detailItems.forEach((item, index) => {
                                if (option.details[index]) {
                                    item.innerHTML = CarQuestionnaireApp.keywordAnnotator.annotateKeywords(option.details[index]);
                                }
                            });
                        }
                    };

                    if (checkbox.checked) {
                        setTimeout(annotateKeywords, 100);
                    }

                    option.addEventListener('click', function(e) {
                        if (!details.contains(e.target)) {
                            checkbox.checked = !checkbox.checked;
                            checkbox.dispatchEvent(new Event('change'));
                        }
                    });

                    checkbox.addEventListener('change', function() {
                        if (this.checked) {
                            details.classList.add('active');
                            toggleIcon.classList.add('active');
                            CarQuestionnaireApp.data.userSelections[this.id] = true;
                            setTimeout(annotateKeywords, 100);
                        } else {
                            details.classList.remove('active');
                            toggleIcon.classList.remove('active');
                            CarQuestionnaireApp.data.userSelections[this.id] = false;
                        }

                        const optionId = this.id;
                        // 找到包含当前选项的题目
                        let questionId = 1;
                        CarQuestionnaireApp.data.questions.forEach(question => {
                            question.options.forEach(option => {
                                if (option.id === optionId) {
                                    questionId = question.id;
                                }
                            });
                        });
                        // 统一使用questionId作为缓存键
                        delete CarQuestionnaireApp.data.cache[`page-${questionId}`];
                        CarQuestionnaireApp.events.updatePageButtonStates();
                    });
                });

            },

            generateResult: function() {
                const resultText = document.getElementById('result-text');
                const selectedData = JSON.parse(localStorage.getItem('selectedOptions') || '[]');

                resultText.innerHTML = '';

                if (selectedData.length > 0) {
                    const groupedByQuestion = {};

                    selectedData.forEach(item => {
                        if (!groupedByQuestion[item.questionTitle]) {
                            groupedByQuestion[item.questionTitle] = [];
                        }
                        groupedByQuestion[item.questionTitle].push(item.optionLabel);
                    });

                    let resultSentence = "我的选车提示词：\n\n";

                    for (const [questionTitle, options] of Object.entries(groupedByQuestion)) {
                        // 去除标题前面的数字标记，如"1. 预算范围"变为"预算范围"
                        const cleanTitle = questionTitle.replace(/^\d+\.\s*/, '');
                        resultSentence += cleanTitle + "：\n";
                        options.forEach((option, index) => {
                            resultSentence += "  " + (index + 1) + ". " + option + "\n";
                        });
                        resultSentence += "\n";
                    }

                    resultSentence += "请使用我的提示词，通过权威的渠道获取信息，将符合的车型做成表格排列。至少筛选出5款车型。";
                    resultText.textContent = resultSentence;
                } else {
                    const emptyResult = document.createElement('div');
                    emptyResult.className = 'empty-result';
                    emptyResult.innerHTML = '<p>您还没有选择任何选项</p><p>请返回选择页面进行选择</p>';
                    resultText.appendChild(emptyResult);
                }
            }
        },

        events: {
            initializeAll: function() {
                this.initializeQuestionEventListeners();
                this.initializeResultEventListeners();
                this.updatePageButtonStates();
                this.initializeKeyboardNavigation();
            },
            
            // 初始化键盘导航
            initializeKeyboardNavigation: function() {
                document.addEventListener('keydown', function(event) {
                    // 获取当前显示的问题ID
                    const activePage = document.querySelector('.page.active');
                    if (!activePage) return;
                    
                    const pageId = activePage.id;
                    const currentQuestionId = parseInt(pageId.split('-')[1]);
                    
                    // 找到包含当前问题的分类
                    let currentCategory = null;
                    let currentCategoryIndex = -1;
                    for (let i = 0; i < mainCategories.length; i++) {
                        if (mainCategories[i].questionIds.includes(currentQuestionId)) {
                            currentCategory = mainCategories[i];
                            currentCategoryIndex = i;
                            break;
                        }
                    }
                    
                    if (!currentCategory) return;
                    
                    const currentIndex = currentCategory.questionIds.indexOf(currentQuestionId);
                    let prevQuestionId = currentIndex > 0 ? currentCategory.questionIds[currentIndex - 1] : null;
                    let nextQuestionId = currentIndex < currentCategory.questionIds.length - 1 ? currentCategory.questionIds[currentIndex + 1] : null;
                    
                    // 如果当前类别没有下一个问题，检查是否存在下一个类别
                    if (!nextQuestionId && currentCategoryIndex < mainCategories.length - 1) {
                        const nextCategory = mainCategories[currentCategoryIndex + 1];
                        if (nextCategory && nextCategory.questionIds.length > 0) {
                            nextQuestionId = nextCategory.questionIds[0];
                        }
                    }
                    
                    // 如果当前类别没有上一个问题，检查是否存在上一个类别
                    if (!prevQuestionId && currentCategoryIndex > 0) {
                        const prevCategory = mainCategories[currentCategoryIndex - 1];
                        if (prevCategory && prevCategory.questionIds.length > 0) {
                            prevQuestionId = prevCategory.questionIds[prevCategory.questionIds.length - 1];
                        }
                    }
                    
                    // 检查是否是最后一道题
                    const isLastQuestion = currentQuestionId === allQuestions[allQuestions.length - 1].id;
                    
                    // 处理键盘事件
                    if (event.key === 'ArrowLeft') {
                        // 左箭头键 - 上一页
                        if (prevQuestionId) {
                            CarQuestionnaireApp.render.renderQuestionNav(prevQuestionId);
                            CarQuestionnaireApp.render.renderPage(prevQuestionId);
                        }
                    } else if (event.key === 'ArrowRight') {
                        // 右箭头键 - 下一页或提交
                        if (isLastQuestion) {
                            // 最后一道题，执行提交
                            const selectedData = [];
                            CarQuestionnaireApp.data.questions.forEach(question => {
                                question.options.forEach(option => {
                                    if (CarQuestionnaireApp.data.userSelections[option.id] === true) {
                                        selectedData.push({
                                            questionTitle: question.title,
                                            optionLabel: option.label
                                        });
                                    }
                                });
                            });
                            
                            localStorage.setItem('selectedOptions', JSON.stringify(selectedData));
                            document.getElementById('question-module').style.display = 'none';
                            document.getElementById('result-module').style.display = 'block';
                            // 隐藏固定导航按钮
                            const fixedNav = document.getElementById('fixed-nav-buttons');
                            if (fixedNav) {
                                fixedNav.style.display = 'none';
                            }
                            CarQuestionnaireApp.render.generateResult();
                        } else if (nextQuestionId) {
                            // 不是最后一道题，执行下一页
                            CarQuestionnaireApp.render.renderQuestionNav(nextQuestionId);
                            CarQuestionnaireApp.render.renderPage(nextQuestionId);
                        }
                    }
                });
            },

            initializeQuestionEventListeners: function() {
                const globalSubmit = document.getElementById('global-submit');
                if (globalSubmit) {
                    globalSubmit.addEventListener('click', function() {
                        const selectedData = [];

                        CarQuestionnaireApp.data.questions.forEach(question => {
                            question.options.forEach(option => {
                                if (CarQuestionnaireApp.data.userSelections[option.id] === true) {
                                    selectedData.push({
                                        questionTitle: question.title,
                                        optionLabel: option.label
                                    });
                                }
                            });
                        });

                        localStorage.setItem('selectedOptions', JSON.stringify(selectedData));
                        document.getElementById('question-module').style.display = 'none';
                        document.getElementById('result-module').style.display = 'block';
                        // 隐藏固定导航按钮
                        const fixedNav = document.getElementById('fixed-nav-buttons');
                        if (fixedNav) {
                            fixedNav.style.display = 'none';
                        }
                        CarQuestionnaireApp.render.generateResult();
                    });
                }

                const clearOptionsBtn = document.getElementById('clear-options');
                if (clearOptionsBtn) {
                    clearOptionsBtn.addEventListener('click', function() {
                        CarQuestionnaireApp.data.userSelections = {};
                        CarQuestionnaireApp.data.cache = {};
                        CarQuestionnaireApp.events.updatePageButtonStates();
                        const activeBtn = document.querySelector('.question-nav-btn.active');
                        if (activeBtn) {
                            const currentQuestionId = parseInt(activeBtn.dataset.question);
                            CarQuestionnaireApp.render.renderQuestionNav(currentQuestionId);
                            CarQuestionnaireApp.render.renderPage(currentQuestionId);
                        }
                    });
                }
            },

            initializeResultEventListeners: function() {
                const copyBtn = document.getElementById('copy-btn');
                const backBtn = document.getElementById('back-btn');

                copyBtn.addEventListener('click', function() {
                    const textToCopy = document.getElementById('result-text').textContent;

                    if (textToCopy && textToCopy !== "") {
                        navigator.clipboard.writeText(textToCopy).then(function() {
                            copyBtn.textContent = "已复制";
                            copyBtn.classList.add('copied');

                            setTimeout(function() {
                                copyBtn.textContent = "复制结果";
                                copyBtn.classList.remove('copied');
                            }, 2000);
                        }).catch(function(err) {
                            console.error('复制失败:', err);
                            alert('复制失败，请手动复制');
                        });
                    } else {
                        alert('没有可复制的内容');
                    }
                });

                backBtn.addEventListener('click', function() {
                    document.getElementById('question-module').style.display = 'block';
                    document.getElementById('result-module').style.display = 'none';
                    // 显示固定导航按钮
                    const fixedNav = document.getElementById('fixed-nav-buttons');
                    if (fixedNav) {
                        fixedNav.style.display = 'flex';
                    }
                    CarQuestionnaireApp.events.updatePageButtonStates();
                });
            },

            updatePageButtonStates: function() {
                const questionNavBtns = document.querySelectorAll('.question-nav-btn');

                questionNavBtns.forEach(btn => {
                    const questionId = parseInt(btn.dataset.question);
                    const question = CarQuestionnaireApp.data.questions.find(q => q.id === questionId);
                    if (question) {
                        const hasSelection = question.options.some(opt => CarQuestionnaireApp.data.userSelections[opt.id] === true);
                        if (hasSelection) {
                            btn.classList.add('has-selection');
                        } else {
                            btn.classList.remove('has-selection');
                        }
                    }
                });
            }
        },

        questionManager: {
            addQuestion: function(questionData) {
                questionData.id = CarQuestionnaireApp.data.questions.length + 1;
                CarQuestionnaireApp.data.questions.push(questionData);
                CarQuestionnaireApp.keywordAnnotator.annotateAllDetails();
                CarQuestionnaireApp.render.generateQuestionnaire();
                CarQuestionnaireApp.events.initializeQuestionEventListeners();
            },

            getQuestionCount: function() {
                return CarQuestionnaireApp.data.questions.length;
            },

            getQuestionById: function(id) {
                return CarQuestionnaireApp.data.questions.find(question => question.id === id);
            }
        },

        keywordAnnotator: {
            keywordModules: {
                budget: {
                    patterns: [
                        { pattern: /(5万以下|5-10万|10-15万|15-20万|20-30万|30万以上)/g, category: 'budget_range' },
                        { pattern: /(裸车价|落地价)/g, category: 'budget_type' },
                        { pattern: /(购置税|新能源免购置税|交强险|950元\/年|商业险|5000-20000元|上牌费|200-500元|车船税|360-5400元\/年|5%-10%|浮动空间)/g, category: 'budget_cost' }
                    ]
                },
                power: {
                    patterns: [
                        { pattern: /(汽油|柴油|混合动力|纯电动|插电混动|增程式|BEV|PHEV|EREV|HEV)/g, category: 'power_type' },
                        { pattern: /(日常代步|动力强劲|能耗经济|最高车速|加速性能|动力输出平顺性)/g, category: 'power_need' },
                        { pattern: /(慢（＞10秒）|适中（7-10秒）|快（5-7秒）|很快（＜5秒）|0-100km\/h加速时间)/g, category: 'acceleration' },
                        { pattern: /(低（＜160km\/h）|中（160-200km\/h）|高（＞200km\/h）|最高设计时速)/g, category: 'max_speed' },
                        { pattern: /(优秀（动力输出非常平顺，无明显顿挫）|良好（动力输出平顺，偶尔有轻微顿挫）|一般（动力输出基本平顺，有明显顿挫）|较差（动力输出不平顺，顿挫明显）|动力输出线性度|换挡间隙|拖拽感|闯动感)/g, category: 'smoothness' },
                        { pattern: /(最大功率|最大扭矩|kW|N·m|百公里加速|最高车速|能耗|油耗|电耗|节能模式|制动能量回收)/g, category: 'power_param' }
                    ]
                },
                finance: {
                    patterns: [
                        { pattern: /(贷款|全款|首付|20%-50%|月供|利息|利率3%-8%|贷款服务费|GPS安装费|现金流|月收入|30%|还款周期|1-5年|征信|资金流动性|应急储备|首保|油费|电费)/g, category: 'finance' }
                    ]
                },
                vehicle: {
                    patterns: [
                        { pattern: /(微型车|小型车|紧凑型车|中型车|中大型车|大型车|SUV|轿车|MPV|跑车|皮卡|新能源车型)/g, category: 'vehicle_type' },
                        { pattern: /(五菱宏光MINIEV|长安Lumin|本田飞度|丰田致炫|吉利帝豪|长安逸动|丰田卡罗拉|大众朗逸|比亚迪秦PLUS DM-i|本田XR-V|本田雅阁|丰田凯美瑞|哈弗H6|大众途岳|比亚迪汉EV|别克君越|丰田亚洲龙|丰田汉兰达|本田冠道|宝马1系|奥迪A3|特斯拉Model 3|宝马3系|奔驰C级|奥迪A4L|奔驰GLC|宝马X3|蔚来ET5|理想L7)/g, category: 'specific_model' },
                        { pattern: /(新能源|纯电动|BEV|插电混动|PHEV|增程式|EREV|汽油|柴油|混合动力|HEV)/g, category: 'vehicle_power' }
                    ]
                },
                configuration: {
                    patterns: [
                        { pattern: /(倒车影像|360全景影像|多功能方向盘|自动空调|定速巡航|全速自适应巡航|电动座椅|自动大灯|座椅加热|车联网|全景天窗|真皮座椅|座椅通风|L2级智能驾驶辅助|BOSE|哈曼卡顿|空气悬架|座椅按摩|丹拿|B&O|全场景智能驾驶辅助|车载冰箱)/g, category: 'configuration' }
                    ]
                },
                usage: {
                    patterns: [
                        { pattern: /(短途通勤|城市代步|长途出行|多人乘坐|家庭出行|跨城自驾|商务接待|越野探险|长途旅行)/g, category: 'usage_scenario' }
                    ]
                },
                cost: {
                    patterns: [
                        { pattern: /(养护成本|油耗|电耗|6-8L\/100km|10-12kWh\/100km|7-9L\/100km|11-13kWh\/100km|8-10L\/100km|12-14kWh\/100km|9-12L\/100km|13-15kWh\/100km|10-15L\/100km|14-18kWh\/100km|保险|保养费用)/g, category: 'cost' }
                    ]
                },
                brand: {
                    patterns: [
                        { pattern: /(合资品牌|国产品牌|豪华品牌|品牌溢价|车辆保值率|个性化定制|宝马|奔驰|奥迪|大众|丰田|本田|吉利|长安|比亚迪|特斯拉|蔚来|理想)/g, category: 'brand' }
                    ]
                },
                road: {
                    patterns: [
                        { pattern: /(城市道路|高速公路|乡村道路|越野路段|综合路况|拥堵路况|恶劣天气路况|非铺装路况)/g, category: 'road_type' },
                        { pattern: /(高温适应|低温适应|雨季适应|雪季适应|全天候适应)/g, category: 'climate_adaptation' },
                        { pattern: /(平原适应|山区适应|高原适应|全地形适应)/g, category: 'terrain_adaptation' },
                        { pattern: /(离地间隙|接近角|离去角|四驱系统|分时四驱|全时四驱|非承载式车身)/g, category: 'off_road' }
                    ]
                },
                special: {
                    patterns: [
                        { pattern: /(商务接待|后排舒适性|车载冰箱|后排娱乐系统|隐私玻璃|香氛系统)/g, category: 'business' },
                        { pattern: /(ISOFIX|儿童安全座椅|儿童门锁|车载吸尘器|电动尾门|全景天窗)/g, category: 'family' },
                        { pattern: /(越野能力|差速锁|低速四驱|多地形模式|AT胎|越野护板)/g, category: 'offroad' },
                        { pattern: /(长途旅行|座椅按摩|自动驾驶辅助|对外放电|油箱容积|纯电续航)/g, category: 'travel' },
                        { pattern: /(个性化定制|车身颜色|轮毂样式|内饰配色|选装包)/g, category: 'personal' }
                    ]
                },
                intelligent: {
                    patterns: [
                        { pattern: /(L2级|L3级|L4级|自动驾驶|智能驾驶)/g, category: 'auto_level' },
                        { pattern: /(自适应巡航|车道保持|自动泊车|紧急制动|智能领航)/g, category: 'assist_functions' },
                        { pattern: /(激光雷达|毫米波雷达|摄像头|高精度定位|传感器)/g, category: 'hardware' },
                        { pattern: /(可靠性|稳定性|故障率|投诉率|传感器故障)/g, category: 'reliability' },
                        { pattern: /(硬件成本|软件订阅|升级费用|年订阅费)/g, category: 'cost' }
                    ]
                },
                infotainment: {
                    patterns: [
                        { pattern: /(车机系统|操作流畅度|响应速度|界面切换|卡顿)/g, category: 'performance' },
                        { pattern: /(语音助手|识别率|响应速度|方言|多轮对话)/g, category: 'voice' },
                        { pattern: /(界面设计|易用性|操作逻辑|夜间模式|盲操作)/g, category: 'ui' },
                        { pattern: /(应用商店|CarPlay|CarLife|HiCar|OTA升级)/g, category: 'app_ecosystem' },
                        { pattern: /(USB-C|无线充电|Wi-Fi|5G|外部设备)/g, category: 'hardware' }
                    ]
                },
                financial: {
                    patterns: [
                        { pattern: /(厂家金融|银行贷款|融资租赁|全款购车)/g, category: 'loan_type' },
                        { pattern: /(低首付|中等首付|高首付|首付比例)/g, category: 'down_payment' },
                        { pattern: /(低月供|中等月供|高月供|月供预算)/g, category: 'monthly_payment' },
                        { pattern: /(审批速度|手续复杂度|还款方式|提前还款|违约金)/g, category: 'convenience' },
                        { pattern: /(年化利率|融资成本|利息支出|贷款期限|放款时间)/g, category: 'cost' }
                    ]
                },
                purchase: {
                    patterns: [
                        { pattern: /(促销季节|新款上市前|新款上市后|无特定时机)/g, category: 'timing' },
                        { pattern: /(高优惠|中等优惠|低优惠|综合优惠|现金优惠)/g, category: 'discount' },
                        { pattern: /(必须现车|接受短周期预订|接受长周期预订|提车时效)/g, category: 'stock' },
                        { pattern: /(高度定制|中度定制|无定制需求|选装包|个性化需求)/g, category: 'customization' },
                        { pattern: /(4S店|汽贸店|线上平台|二手车市场|购车渠道)/g, category: 'channel' }
                    ]
                },
                feature: {
                    patterns: [
                        { pattern: /(智能驾驶辅助|车道保持|主动刹车|安全性|AEB自动刹车|车道偏离预警|自适应巡航|ACC|LKA|自动泊车|疲劳驾驶提醒)/g, category: 'feature_value' },
                        { pattern: /(五星|四星|三星|二星及以下|NCAP|C-NCAP|IIHS|安全评级)/g, category: 'safety_rating' },
                        { pattern: /(ESP|ABS|EBD|TCS|电子稳定程序|防抱死制动系统|电子制动力分配|牵引力控制系统)/g, category: 'active_safety' },
                        { pattern: /(LKA|LDW|车道保持辅助|车道偏离预警|ACC|自适应巡航|AEB|主动刹车|BSD|盲区监测|LCA|变道辅助|RCTA|倒车侧向预警|TPMS|胎压监测)/g, category: 'driver_assist' },
                        { pattern: /(安全气囊|前排双安全气囊|前排侧气囊|前后排头部气帘|膝部气囊|后排侧气囊|车身结构|超高强度钢|热成型钢|溃缩区设计|笼式车身)/g, category: 'passive_safety' },
                        { pattern: /(自适应远近光|夜视系统|红外热成像|灯光照射距离|灯光照射宽度)/g, category: 'night_assist' },
                        { pattern: /(CarPlay|Android Auto|华为HiCar|智能互联|无线连接|有线连接|手机映射)/g, category: 'connectivity' },
                        { pattern: /(车载娱乐|屏幕尺寸|分辨率|2K|1080P|720P|芯片算力|内存|HDR|屏占比|触控采样率)/g, category: 'entertainment' },
                        { pattern: /(导航系统|实时路况|在线更新|AR实景导航|车道级导航|北斗|GPS|定位精度|POI)/g, category: 'navigation' },
                        { pattern: /(远程控制|远程启动|远程空调|远程门锁|远程寻车|APP控制|4G|5G|车联网)/g, category: 'remote_control' },
                        { pattern: /(在线音乐|语音助手|OTA升级|在线电台|车载Wi-Fi|远程诊断|方言识别)/g, category: 'carnet' },
                        { pattern: /(全液晶仪表盘|半液晶仪表盘|传统仪表盘|ADAS|自定义主题|中控屏联动)/g, category: 'dashboard' },
                        { pattern: /(HUD|抬头显示|全彩HUD|单色HUD|投射尺寸|分辨率|亮度调节)/g, category: 'hud' },
                        { pattern: /(真皮|仿皮|织物|电动调节|手动调节|座椅加热|座椅通风|座椅按摩|座椅记忆|腰托|腿托)/g, category: 'seat' },
                        { pattern: /(双区恒温|三区恒温|PM2.5|空气净化|香氛系统|负离子|活性炭|自动除雾)/g, category: 'air_conditioner' },
                        { pattern: /(BOSE|B&O|哈曼卡顿|柏林之声|燕飞利仕|先锋|索尼|扬声器|功放|杜比全景声|环绕声)/g, category: 'audio' },
                        { pattern: /(全景天窗|氛围灯|无线充电|USB接口|后排娱乐|车载冰箱|老板键|后排出风口)/g, category: 'other_comfort' },
                        { pattern: /(双层夹胶玻璃|隔音棉|隔音毡|隔音罩|噪音控制|隔热玻璃|隔热率|隐私玻璃)/g, category: 'sound_insulation' },
                        { pattern: /(油耗|L\/100km|燃油经济性|燃油成本|市区油耗|高速油耗|综合油耗)/g, category: 'fuel_economy' },
                        { pattern: /(续航里程|CLTC|NEDC|充电速度|充电功率|快充桩|充电便利性|续航折损率)/g, category: 'electric_consumption' },
                        { pattern: /(综合能耗成本|年均综合能耗成本|电费|油电成本|基础保养|配件更换)/g, category: 'energy_cost' },
                        { pattern: /(真实续航|官方续航|续航差异|城市通勤|冬季低温|续航焦虑)/g, category: 'range_accuracy' },
                        { pattern: /(常规保养|大保养|保养成本|年均保养成本|机油|机滤|空滤|变速箱油|刹车油|火花塞)/g, category: 'maintenance_cost' },
                        { pattern: /(交强险|商业险|车损险|第三者责任险|不计免赔|零整比系数|保费|总保费)/g, category: 'insurance_cost' },
                        { pattern: /(零部件|配件|易损件|刹车片|轮胎|保险杠|原厂件|副厂件|通用件|专属定制)/g, category: 'parts_price' },
                        { pattern: /(可靠性|故障频率|百车故障数|PPH|重大故障|核心总成|维修次数)/g, category: 'reliability' },
                        { pattern: /(维修等待时间|配件到货时间|维修周期|售后网点|配件中心库|库存周转率)/g, category: 'repair_time' },
                        { pattern: /(国六|欧六|国五|欧五|排放标准|NOx|颗粒物|CO|碳氢化合物)/g, category: 'emission_standard' },
                        { pattern: /(纯电动|混动|插电混动|油电混动|氢能源|新能源牌照|零排放|碳排放)/g, category: 'new_energy' },
                        { pattern: /(电池回收|梯次利用|材料再生|退役电池|回收网络|溯源体系)/g, category: 'battery_recycle' },
                        { pattern: /(环保意识|全生命周期|绿电充电|电池回收服务|环保溢价)/g, category: 'eco_awareness' },
                        { pattern: /(国内品牌|合资品牌|进口品牌|本土品牌|原装进口|品牌溢价|品牌信赖)/g, category: 'brand_type' },
                        { pattern: /(一线品牌|二线品牌|小众品牌|品牌知名度|市场表现|保值率|品控)/g, category: 'brand_level' },
                        { pattern: /(中国品牌|欧美品牌|日韩品牌|国别|品牌历史|技术积淀)/g, category: 'country_preference' },
                        { pattern: /(品牌口碑|用户评价|故障率|售后满意度|投诉解决率|复购率|推荐率)/g, category: 'brand_reputation' },
                        { pattern: /(品牌调性|运动|豪华|家用|科技|驾驶乐趣|内饰用料|智能座舱)/g, category: 'brand_style' },
                        { pattern: /(销量|保有量|月均销量|累计销量|配件供应|维修便利|二手车市场|残值率)/g, category: 'sales_volume' },
                        { pattern: /(用户口碑|好评率|综合评分|NPS|推荐意愿|续购|换购)/g, category: 'user_review' },
                        { pattern: /(投诉量|投诉率|质量缺陷|召回|问题解决|故障投诉)/g, category: 'complaint' },
                        { pattern: /(交付体验|交付周期|交付流程|PDI检测|随车资料|服务态度)/g, category: 'delivery' },
                        { pattern: /(售后服务|服务便捷|服务专业|收费透明|一次修复率|增值服务)/g, category: 'after_sales' },
                        { pattern: /(保修期|质保政策|整车质保|动力电池质保|质保转移|质保范围|延保服务)/g, category: 'warranty' },
                        { pattern: /(维修网络|4S店|直营店|授权维修点|移动服务|上门维修|紧急救援|配件中心库)/g, category: 'service_network' },
                        { pattern: /(配件供应|配件库存|配送时效|进口配件|配件价格|加急费)/g, category: 'parts_supply' },
                        { pattern: /(服务响应|预约响应|进店等待|道路救援|投诉处理|客服电话)/g, category: 'service_response' },
                        { pattern: /(技师认证|高级技师|专业培训|服务顾问|技术培训|故障诊断)/g, category: 'staff_quality' }
                    ]
                },
                space: {
                    patterns: [
                        { pattern: /(2座|5座|6-7座|8座以上|第三排|头部空间|腿部空间|肩部空间|宽敞|适中|紧凑|≥1000mm|950-1000mm|<950mm|850-1000mm|<850mm|≥1400mm|1300-1400mm|<1300mm|≥950mm|900-950mm|<900mm|≥900mm|750-900mm|<750mm|≥1350mm|1250-1350mm|<1250mm)/g, category: 'space' },
                        { pattern: /(后备箱容量|常规容量|放倒后容量|≥500L|350-500L|<350L|≥1500L|1000-1500L|<1000L)/g, category: 'trunk' },
                        { pattern: /(储物空间|数量|设计|丰富（≥10个）|适中（6-10个）|基本（<6个）|合理（布局科学，功能多样）|基本（布局合理，功能简单）|不足（布局不合理，功能单一）)/g, category: 'storage' }
                    ]
                },
                driving: {
                    patterns: [
                        { pattern: /(日常代步|动力强劲|能耗经济|0-60km\/h|0-100km\/h|加速时间|最大功率|最大扭矩|180kW|350N·m|百公里油耗|百公里电耗|7L|12kWh)/g, category: 'power_need' },
                        { pattern: /(慢（＞10秒）|适中（7-10秒）|快（5-7秒）|很快（＜5秒）|加速时间|推背感|性能取向)/g, category: 'acceleration' },
                        { pattern: /(低（＜160km\/h）|中（160-200km\/h）|高（＞200km\/h）|最高设计时速|高速巡航|超车需求)/g, category: 'top_speed' },
                        { pattern: /(优秀（动力输出非常平顺，无明显顿挫）|良好（动力输出平顺，偶尔有轻微顿挫）|一般（动力输出基本平顺，有明显顿挫）|较差（动力输出不平顺，顿挫明显）|线性度|换挡间隙|拖拽感|闯动感)/g, category: 'smoothness' },
                        { pattern: /(舒适型|运动型|操控型|悬挂调校|转向特性|动力响应|路感反馈|车身侧倾)/g, category: 'driving_style' },
                        { pattern: /(手动|自动|CVT|双离合|AMT|换挡方式|传动效率|平顺性|燃油经济性|维护成本)/g, category: 'transmission' },
                        { pattern: /(前驱|后驱|四驱|全时四驱|适时四驱|动力分配|通过性|稳定性|燃油经济性|操控性)/g, category: 'drive_mode' }
                    ]
                },
                exterior: {
                    patterns: [
                        { pattern: /(运动|稳重|时尚|复古|科技感)/g, category: 'style' },
                        { pattern: /(白色|黑色|银色|灰色|红色|蓝色|金色|橙色|绿色|哑光色|渐变色)/g, category: 'color' },
                        { pattern: /(前脸设计|车灯造型|轮毂样式|尾部设计|运动型|稳重型|时尚型|科技型|锐利型|圆润型|经典型)/g, category: 'exterior_detail' },
                        { pattern: /(小型|紧凑型|中型|中大型|大型|车长<4.2米|车长4.2-4.6米|车长4.6-4.9米|车长4.9-5.2米|车长>5.2米)/g, category: 'size' },
                        { pattern: /(普通漆|金属漆|珠光漆|特殊工艺漆|哑光漆|渐变色漆|磨砂漆|星空漆)/g, category: 'paint' }
                    ]
                },
                convenience: {
                    patterns: [
                        { pattern: /(车内视野|前方视野|侧方视野|后方视野|开阔（视野范围大，盲区小）|适中（视野范围适中，盲区较小）|受限（视野范围小，盲区较大）)/g, category: 'visibility' },
                        { pattern: /(日常使用便利性|优秀（各项功能操作便捷，使用体验好）|良好（大多数功能操作便捷，使用体验良好）|一般（部分功能操作不便，使用体验一般）|较差（多项功能操作不便，使用体验差）)/g, category: 'convenience' },
                        { pattern: /(装载能力|优秀（装载空间大，适合各种装载需求）|良好（装载空间适中，能满足大多数装载需求）|一般（装载空间有限，仅能满足基本装载需求）|较差（装载空间小，难以满足日常装载需求）)/g, category: 'loading' },
                        { pattern: /(后排座椅灵活性|优秀（支持多种放倒方式，调节灵活）|良好（支持基本放倒方式，调节较为灵活）|一般（仅支持简单放倒，调节有限）|较差（不支持放倒或调节，灵活性差）)/g, category: 'seats_flexibility' },
                        { pattern: /(上下车便利性|优秀（车门开度大，门槛高度适中，上下车便捷）|良好（车门开度适中，门槛高度合理，上下车较为便捷）|一般（车门开度较小，门槛高度偏高，上下车不太便捷）|较差（车门开度小，门槛高度高，上下车不便）)/g, category: 'access' },
                        { pattern: /(儿童安全座椅安装便利性|优秀（配备多个ISOFIX接口，安装便捷）|良好（配备基本ISOFIX接口，安装较为便捷）|一般（ISOFIX接口有限，安装不太便捷）|较差（无ISOFIX接口，安装不便）|ISOFIX接口|Top Tether)/g, category: 'child_seat' },
                        { pattern: /(盲操作准确率|物理按键|触控|车机系统|菜单层级|储物格|杯架|中央扶手箱|车门储物格)/g, category: 'convenience_detail' },
                        { pattern: /(后备箱容积|L|轿车|SUV|MPV|28寸|24寸|20寸|行李箱|折叠婴儿车|开口宽度|门槛高度)/g, category: 'loading_detail' },
                        { pattern: /(4\/6比例放倒|整体放倒|靠背角度|座椅前后滑动|放倒后|台阶高度|平整装载长度)/g, category: 'seat_flex_detail' },
                        { pattern: /(车门开度|前排车门|后排车门|门槛宽度|防滑设计|车门内侧扶手|防夹功能)/g, category: 'access_detail' },
                        { pattern: /(ISOFIX|Top Tether|上拉带接口|咔嗒声|晃动幅度|正向安装|反向安装)/g, category: 'child_seat_detail' },
                        { pattern: /(响应速度|＜1秒|1-2秒|2-3秒|＞3秒|卡顿|闪退)/g, category: 'tech_performance' },
                        { pattern: /(≥500L|≥800L|350-500L|600-800L|250-350L|400-600L|＜250L|＜400L|≥1500L|1000-1500L|600-1000L|＜600L)/g, category: 'volume_spec' },
                        { pattern: /(≥100cm|80-100cm|60-80cm|＜60cm|≥80cm|70-80cm|60-70cm|＜60cm)/g, category: 'dimension_spec' },
                        { pattern: /(≤40cm|40-50cm|50-60cm|＞60cm|≤35cm|35-40cm|40-45cm|45-50cm|＞50cm)/g, category: 'height_spec' },
                        { pattern: /(≥70°|60-70°|50-60°|＜50°|≥80°|70-80°|60-70°|＜60°)/g, category: 'angle_spec' },
                        { pattern: /(≥15cm|5-15cm|＜15cm|≥1\.8m|1\.5-1\.8m|1\.2-1\.5m)/g, category: 'length_spec' },
                        { pattern: /(盲操作|按键布局|人体工学|一键直达|菜单层级)/g, category: 'operation_spec' }
                    ]
                },
                purchase: {
                    patterns: [
                        { pattern: /(新车|二手车|租赁|短租|长租|超长期租)/g, category: 'purchase_type' }
                    ]
                },
                purpose: {
                    patterns: [
                        { pattern: /(日常通勤|家庭使用|商务接待|越野探险|长途旅行)/g, category: 'purpose' },
                        { pattern: /(日常上下班|城市内短途|高频次出行|工作日通勤|短途办事)/g, category: 'commute' },
                        { pattern: /(接送老人|接送孩子|家庭购物|周末近郊出游|家庭全场景出行)/g, category: 'family_use' },
                        { pattern: /(客户接送|商务差旅|公司会务|政企客户|高端商务接待)/g, category: 'business' },
                        { pattern: /(户外越野|复杂路况|山地|沙漠|非铺装路|穿越|探险)/g, category: 'off_road' },
                        { pattern: /(跨城市|长距离出行|自驾游|跨省探亲|长途差旅)/g, category: 'long_trip' },
                        { pattern: /(≤30km|30-50km|＞50km|≥5天|常态化拥堵|偶尔拥堵|基本畅通|侧方停车|转弯半径)/g, category: 'commute_detail' },
                        { pattern: /(2-3人|4-5人|≤5人|6-7人|儿童座椅|老人上下车|婴儿车|行李箱|露营装备)/g, category: 'family_detail' },
                        { pattern: /(后排腿部空间|后排头部空间|座椅按摩|小桌板|隐私玻璃|车载香氛|迎宾踏板)/g, category: 'business_detail' },
                        { pattern: /(轻度越野|中度越野|重度越野|≥200mm|180-200mm|＜180mm|≥30°|≥25°|≥20°)/g, category: 'off_road_detail' },
                        { pattern: /(分时四驱|全时四驱|适时四驱|差速锁|非承载式|承载式|AT胎|MT胎|公路胎)/g, category: 'off_road_tech' },
                        { pattern: /(陡坡缓降|坦克掉头|蠕行模式|越野模式切换|泥地|沙地|雪地)/g, category: 'off_road_feature' },
                        { pattern: /(3-5小时|5-8小时|＞8小时|≤300km|300-500km|＞500km|高速占比|≥80%|50-80%|＜50%)/g, category: 'long_trip_detail' },
                        { pattern: /(定速巡航|自适应巡航|ACC|车道保持辅助|LKA|自动泊车|疲劳驾驶提醒)/g, category: 'assist_drive' },
                        { pattern: /(长途抛锚|保养周期|备胎|应急工具|可靠性|故障率)/g, category: 'reliability' }
                    ]
                },
                seats: {
                    patterns: [
                        { pattern: /(2座|4-5座|6-7座|8座以上|多人乘坐)/g, category: 'seats' },
                        { pattern: /(固定1人|固定2人|临时多人乘坐|城市微型代步|个性化代步)/g, category: 'two_seat' },
                        { pattern: /(主流家用|小家庭|小团队日常出行|乘坐与储物平衡)/g, category: 'four_five_seat' },
                        { pattern: /(大家庭|多成员出行|6-7人同时乘坐|节假日多人出行)/g, category: 'six_seven_seat' },
                        { pattern: /(大型家庭|商务团队|营运场景|8人及以上|合规性与承载能力)/g, category: 'eight_plus_seat' },
                        { pattern: /(第三排使用|第三排乘员|第三排放倒|2\+2\+3|2\+3\+2|2\+2\+2)/g, category: 'third_row' },
                        { pattern: /(后排腿部空间|≥两拳|一拳|半拳|头部空间|中间座位舒适性)/g, category: 'rear_space' },
                        { pattern: /(后排座椅放倒|46分折|整体放倒|拓展储物空间)/g, category: 'seat_fold' },
                        { pattern: /(车门开度|门槛高度|侧滑门|平开门|踏步高度|≤30cm)/g, category: 'access_convenience' },
                        { pattern: /(C照|B照|年检要求|限行限载|准驾车型)/g, category: 'regulation' }
                    ]
                },
                vehicleTypeDetail: {
                    patterns: [
                        { pattern: /(铺装路面行驶|操控性|舒适性|燃油经济性)/g, category: 'sedan_feature' },
                        { pattern: /(紧凑型|中型|中大型|豪华级|轴距|＜2700mm|2700-2900mm|＞2900mm)/g, category: 'size_class' },
                        { pattern: /(通过性|空间灵活性|小型SUV|紧凑型SUV|中型SUV|中大型SUV|硬派越野SUV)/g, category: 'suv_feature' },
                        { pattern: /(后备箱开口|后排放倒|储物容积|≥1500L|1000-1500L|＜1000L|车顶行李架)/g, category: 'cargo_space' },
                        { pattern: /(360全景影像|视野盲区|坐姿高于轿车|360度影像)/g, category: 'visibility_feature' },
                        { pattern: /(两驱|适时四驱|全时四驱|分时四驱|轻度越野|中度越野|重度越野)/g, category: 'drive_system' },
                        { pattern: /(多人乘坐舒适性|空间实用性|家用型|商务型MPV|航空座椅)/g, category: 'mpv_feature' },
                        { pattern: /(侧滑门|单侧|双侧|地台高度|≤1850mm|≤400mm|车身宽度)/g, category: 'mpv_detail' },
                        { pattern: /(后扭力梁|多连杆|底盘悬挂|满载百公里)/g, category: 'suspension' },
                        { pattern: /(性能与驾驶乐趣|入门级跑车|超跑|百公里加速|极速)/g, category: 'sportscar_feature' },
                        { pattern: /(≤4秒|4-6秒|6-8秒|≥250km\/h|200-250km\/h|＜200km\/h|自吸|涡轮|电动)/g, category: 'sportscar_perf' },
                        { pattern: /(≤100mm|100-120mm|赛道级|运动级|百公里制动距离|≤35米)/g, category: 'sportscar_control' },
                        { pattern: /(声浪|定制化配置|车漆|内饰|轮毂|个性化)/g, category: 'sportscar_custom' },
                        { pattern: /(载货能力|乘用与载货|商用型|乘用型皮卡|货箱)/g, category: 'pickup_feature' },
                        { pattern: /(≤500kg|500-1000kg|＞1000kg|货箱盖|龙门架|≥1\.5米|1\.2-1\.5米|＜1\.2米)/g, category: 'pickup_cargo' },
                        { pattern: /(城市限行|允许进城|限时进城|禁止进城|1年1检|6年免检|报废年限|15年)/g, category: 'pickup_policy' },
                        { pattern: /(纯电动|BEV|插电混动|PHEV|增程式|EREV|低使用成本|环保)/g, category: 'ne_type' },
                        { pattern: /(家充桩|公共充电|快充效率|30%-80%|≤30分钟|30-60分钟|＞60分钟)/g, category: 'charging' },
                        { pattern: /(纯电续航|≥400km|300-400km|＜300km|冬季续航折扣|≤20%|20-30%|＞30%)/g, category: 'range' },
                        { pattern: /(磷酸铁锂|三元锂|终身质保|8年\/15万公里|5年\/10万公里|电池质保)/g, category: 'battery' },
                        { pattern: /(百公里电费|≤10元|10-15元|＞15元|换电|维修成本)/g, category: 'ev_cost' },
                        { pattern: /(智能座舱|车机流畅度|语音控制|高阶智驾|基础辅助|车联网)/g, category: 'smart_feature' }
                    ]
                },
                purchaseTypeDetail: {
                    patterns: [
                        { pattern: /(全新车辆|厂家完整质保|最新版本|长期持有|品质与保障)/g, category: 'new_car' },
                        { pattern: /(购置税|保险|上牌费|首付比例|全款|30%|50%|70%|贷款利息)/g, category: 'new_car_cost' },
                        { pattern: /(持有年限|≥5年|3-5年|1-3年|年均行驶里程|≤1万公里|1-2万公里|＞2万公里)/g, category: 'ownership' },
                        { pattern: /(高阶智驾|8155芯片车机|个性化定制|选装包)/g, category: 'new_car_config' },
                        { pattern: /(整车≥3年\/10万公里|免费保养次数|4S店售后网点)/g, category: 'warranty' },
                        { pattern: /(三年保值率|残值曲线|改款频率|贬值)/g, category: 'resale_value' },
                        { pattern: /(已上牌|使用过的车辆|价格低于新车|高性价比|预算有限)/g, category: 'used_car' },
                        { pattern: /(车龄|≤3年|3-5年|＞5年|里程数|≤3万公里|3-8万公里|＞8万公里|过户次数)/g, category: 'used_car_age' },
                        { pattern: /(发动机大修|变速箱渗油|底盘托底|重大事故|泡水车|火烧车|原厂漆)/g, category: 'used_car_condition' },
                        { pattern: /(4S店保养|易损件|轮胎|刹车片|电瓶|保险出险记录)/g, category: 'maintenance_record' },
                        { pattern: /(整备费用|二手车保费|上浮比例|≤6年免检|6-10年1年1检|＞10年1年2检)/g, category: 'used_car_cost' },
                        { pattern: /(正规车商|个人交易|第三方检测报告|车商质保|1年\/3万公里|无质保)/g, category: 'transaction_guarantee' },
                        { pattern: /(支付租金|车辆使用权|残值贬值风险|频繁换车)/g, category: 'lease' },
                        { pattern: /(1-3个月|6-12个月|≥24个月|续租可能性)/g, category: 'lease_term' },
                        { pattern: /(年里程额度|无限制|超里程计费|元\/公里)/g, category: 'mileage_limit' },
                        { pattern: /(保养责任|维修责任|出租方承担|承租方承担|交强险|三者险≥200万|车损险)/g, category: 'lease_responsibility' },
                        { pattern: /(月租金|押金金额|可退|不可退|违约金|提前退租|逾期还车)/g, category: 'lease_cost' },
                        { pattern: /(买断|买断价格|车辆过户费用)/g, category: 'lease_buyout' }
                    ]
                }
            },

            _cachedPatterns: null,

            getAllPatterns: function() {
                if (!this._cachedPatterns) {
                    const allPatterns = [];
                    Object.values(this.keywordModules).forEach(module => {
                        allPatterns.push(...module.patterns);
                    });
                    this._cachedPatterns = allPatterns.sort((a, b) => {
                        const aLength = a.pattern.source.length;
                        const bLength = b.pattern.source.length;
                        return bLength - aLength;
                    });
                }
                return this._cachedPatterns;
            },

            annotateKeywords: function(text) {
                if (!text || text.length === 0) {
                    return text;
                }

                let annotatedText = text;
                const patterns = this.getAllPatterns();

                patterns.forEach(({ pattern }) => {
                    annotatedText = annotatedText.replace(pattern, '<span class="keyword">$&</span>');
                });

                return annotatedText;
            },

            annotateAllDetails: function() {
                CarQuestionnaireApp.data.questions.forEach(question => {
                    question.options.forEach(option => {
                        option.details = option.details.map(detail => {
                            return this.annotateKeywords(detail);
                        });
                    });
                });
            },

            getModulePatterns: function(moduleName) {
                if (this.keywordModules[moduleName]) {
                    return this.keywordModules[moduleName].patterns;
                }
                return [];
            },

            addCustomPatterns: function(questionId, customPatterns) {
            }
        },

        validation: {
            validateSelections: function() {
                const errors = [];
                let isValid = true;
                let hasAnySelection = false;
                const { questions, userSelections } = CarQuestionnaireApp.data;

                questions.forEach(question => {
                    question.options.forEach(option => {
                        if (userSelections[option.id] === true) {
                            hasAnySelection = true;
                        }
                    });
                });

                if (!hasAnySelection) {
                    errors.push('请至少选择一个选项');
                    isValid = false;
                }

                return { isValid, errors };
            },

            validateQuestion: function(questionId) {
                const question = CarQuestionnaireApp.questionManager.getQuestionById(questionId);
                if (!question) {
                    return { isValid: false, errors: ['题目不存在'] };
                }

                let hasSelection = false;
                question.options.forEach(option => {
                    if (CarQuestionnaireApp.data.userSelections[option.id] === true) {
                        hasSelection = true;
                    }
                });

                if (!hasSelection) {
                    return { isValid: false, errors: [`请为"${question.title}"选择至少一个选项`] };
                }

                return { isValid: true, errors: [] };
            },

            showErrors: function(errors) {
                if (errors.length > 0) {
                    const errorMessage = errors.join('\n');
                    alert(errorMessage);
                }
            }
        },

        // 创建固定导航按钮容器
        createFixedNavButtons: function() {
            // 检查是否已存在固定导航按钮容器
            if (!document.getElementById('fixed-nav-buttons')) {
                const container = document.createElement('div');
                container.id = 'fixed-nav-buttons';
                container.className = 'fixed-nav-buttons';
                container.innerHTML = `
                    <button class="nav-btn btn btn-outline" id="fixed-prev-btn" disabled>上一页</button>
                    <button class="nav-btn btn btn-outline" id="fixed-next-btn" disabled>下一页</button>
                `;
                document.body.appendChild(container);
                
                // 检查当前是否在结果页面，如果是则隐藏
                const resultModule = document.getElementById('result-module');
                if (resultModule && resultModule.style.display === 'block') {
                    container.style.display = 'none';
                }
            }
        },

        // 更新固定导航按钮状态
        updateFixedNavButtons: function(currentQuestionId) {
            console.log('updateFixedNavButtons called with currentQuestionId:', currentQuestionId);
            // 确保currentQuestionId是数字
            const questionIdNum = parseInt(currentQuestionId);
            console.log('questionIdNum:', questionIdNum);
            // 找到包含当前问题的分类
            let currentCategory = null;
            let currentCategoryIndex = -1;
            for (let i = 0; i < mainCategories.length; i++) {
                if (mainCategories[i].questionIds.includes(questionIdNum)) {
                    currentCategory = mainCategories[i];
                    currentCategoryIndex = i;
                    break;
                }
            }
            console.log('currentCategory:', currentCategory);
            if (!currentCategory) return;

            const currentIndex = currentCategory.questionIds.indexOf(questionIdNum);
            console.log('currentIndex:', currentIndex);
            let prevQuestionId = currentIndex > 0 ? currentCategory.questionIds[currentIndex - 1] : null;
            let nextQuestionId = currentIndex < currentCategory.questionIds.length - 1 ? currentCategory.questionIds[currentIndex + 1] : null;
            
            // 如果当前类别没有下一个问题，检查是否存在下一个类别
            if (!nextQuestionId && currentCategoryIndex < mainCategories.length - 1) {
                const nextCategory = mainCategories[currentCategoryIndex + 1];
                if (nextCategory && nextCategory.questionIds.length > 0) {
                    nextQuestionId = nextCategory.questionIds[0];
                }
            }
            
            // 如果当前类别没有上一个问题，检查是否存在上一个类别
            if (!prevQuestionId && currentCategoryIndex > 0) {
                const prevCategory = mainCategories[currentCategoryIndex - 1];
                if (prevCategory && prevCategory.questionIds.length > 0) {
                    prevQuestionId = prevCategory.questionIds[prevCategory.questionIds.length - 1];
                }
            }
            
            console.log('prevQuestionId:', prevQuestionId);
            console.log('nextQuestionId:', nextQuestionId);

            const prevBtn = document.getElementById('fixed-prev-btn');
            const nextBtn = document.getElementById('fixed-next-btn');
            console.log('prevBtn:', prevBtn);
            console.log('nextBtn:', nextBtn);

            if (prevBtn) {
                prevBtn.disabled = !prevQuestionId;
                prevBtn.onclick = prevBtn.disabled ? null : function() {
                    if (prevQuestionId) {
                        CarQuestionnaireApp.render.renderQuestionNav(prevQuestionId);
                        CarQuestionnaireApp.render.renderPage(prevQuestionId);
                    }
                };
            }

            // 检查是否是最后一道题
            const isLastQuestion = questionIdNum === allQuestions[allQuestions.length - 1].id;
            
            if (nextBtn) {
                if (isLastQuestion) {
                    // 最后一道题，显示为"提交选择"
                    nextBtn.textContent = '提交选择';
                    nextBtn.disabled = false;
                    nextBtn.onclick = function() {
                        // 执行与顶部提交选择按钮相同的功能
                        const selectedData = [];
                        CarQuestionnaireApp.data.questions.forEach(question => {
                            question.options.forEach(option => {
                                if (CarQuestionnaireApp.data.userSelections[option.id] === true) {
                                    selectedData.push({
                                        questionTitle: question.title,
                                        optionLabel: option.label
                                    });
                                }
                            });
                        });

                        localStorage.setItem('selectedOptions', JSON.stringify(selectedData));
                        document.getElementById('question-module').style.display = 'none';
                        document.getElementById('result-module').style.display = 'block';
                        // 隐藏固定导航按钮
                        const fixedNav = document.getElementById('fixed-nav-buttons');
                        if (fixedNav) {
                            fixedNav.style.display = 'none';
                        }
                        CarQuestionnaireApp.render.generateResult();
                    };
                } else {
                    // 不是最后一道题，显示为"下一页"
                    nextBtn.textContent = '下一页';
                    nextBtn.disabled = !nextQuestionId;
                    nextBtn.onclick = nextBtn.disabled ? null : function() {
                        if (nextQuestionId) {
                            CarQuestionnaireApp.render.renderQuestionNav(nextQuestionId);
                            CarQuestionnaireApp.render.renderPage(nextQuestionId);
                        }
                    };
                }
            }
        },

        init: function() {
            CarQuestionnaireApp.createFixedNavButtons();
            // 确保DOM已经完全更新
            setTimeout(function() {
                CarQuestionnaireApp.render.generateQuestionnaire();
                CarQuestionnaireApp.events.initializeAll();
            }, 0);
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded event fired');
        console.log('Questions length:', CarQuestionnaireApp.data.questions.length);
        CarQuestionnaireApp.init();

        // 主题切换功能
        const themeToggle = document.getElementById('theme-toggle');
        const lightIcon = themeToggle.querySelector('.light-icon');
        const darkIcon = themeToggle.querySelector('.dark-icon');
        
        document.body.classList.add('dark-mode');
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline';
        localStorage.setItem('theme', 'dark');
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'inline';
                localStorage.setItem('theme', 'dark');
            } else {
                lightIcon.style.display = 'inline';
                darkIcon.style.display = 'none';
                localStorage.setItem('theme', 'light');
            }
        });

        // 说明按钮点击事件
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const closeBtn = helpModal.querySelector('.close');

        // 打开模态框
        helpBtn.addEventListener('click', function() {
            helpModal.style.display = 'block';
        });

        // 关闭模态框
        closeBtn.addEventListener('click', function() {
            helpModal.style.display = 'none';
        });

        // 点击模态框外部关闭
        window.addEventListener('click', function(event) {
            if (event.target == helpModal) {
                helpModal.style.display = 'none';
            }
        });
    });
