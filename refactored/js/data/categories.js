// ================================================================
// 分类映射、数据合并
// ================================================================

const allQuestions = [
        ...part1_Budget,
        ...part2_BasicNeeds,
        ...part3_VehicleType,
        ...part4_PurchaseType,
        ...part5_ExteriorDesign,
        ...part6_InteriorDesign,
        ...part7_PowerPerformance,
        ...part8_DrivingExperience,
        ...part9_HandlingPerformance,
        ...part10_InteriorSpace,
        ...part11_Practicality,
        ...part12_SafetyConfiguration,
        ...part13_TechnologyConfiguration,
        ...part14_ComfortConfiguration,
        ...part15_EnergyConsumption,
        ...part16_MaintenanceCost,
        ...part17_EnvironmentalFactors,
        ...part18_BrandPreference,
        ...part19_MarketReview,
        ...part20_AfterSalesService,
        ...part21_RoadAdaptation,
        ...part22_SpecialNeeds,
        ...part23_IntelligentDriving,
        ...part24_CarInfotainment,
        ...part25_FinancialFactors,
        ...part26_PurchaseDecision
    ];

    // 基于起始ID的分类映射，用于快速查找题目分类
    // 格式：{ 起始题目ID: { main: "主分类", sub: "子分类" } }
    // 注意：题目ID必须连续，新题目应添加到对应分类的末尾
    const categoryMap = {
        1: { main: "一、基础信息", sub: "购车预算" },
        4: { main: "一、基础信息", sub: "基本需求" },
        6: { main: "一、基础信息", sub: "车辆类型" },
        7: { main: "一、基础信息", sub: "购车类型" },
        8: { main: "二、外观设计", sub: "外观设计" },
        13: { main: "三、内饰设计", sub: "内饰设计" },
        18: { main: "四、动力性能", sub: "动力性能" },
        23: { main: "五、驾驶体验", sub: "驾驶体验" },
        30: { main: "六、操控性能", sub: "操控性能" },
        36: { main: "七、内部空间", sub: "内部空间" },
        41: { main: "八、实用功能", sub: "实用功能" },
        46: { main: "九、安全配置", sub: "安全配置" },
        51: { main: "十、科技配置", sub: "科技配置" },
        58: { main: "十一、舒适配置", sub: "舒适配置" },
        63: { main: "十二、能耗表现", sub: "能耗表现" },
        67: { main: "十三、维护成本", sub: "维护成本" },
        72: { main: "十四、环保因素", sub: "环保因素" },
        76: { main: "十五、品牌偏好", sub: "品牌偏好" },
        81: { main: "十六、市场评价", sub: "市场评价" },
        86: { main: "十七、售后服务", sub: "售后服务" },
        91: { main: "十八、路况适应", sub: "路况适应" },
        95: { main: "十九、特殊需求", sub: "特殊需求" },
        100: { main: "二十、智能驾驶", sub: "智能驾驶" },
        104: { main: "二十一、车机系统", sub: "车机系统" },
        108: { main: "二十二、金融因素", sub: "金融因素" },
        112: { main: "二十三、购买决策", sub: "购买决策" }
    };

    // 根据题目ID获取分类信息的函数
    function getCategory(questionId) {
        // 找到小于等于当前questionId的最大键
        const keys = Object.keys(categoryMap).map(Number).sort((a, b) => b - a);
        for (const key of keys) {
            if (key <= questionId) {
                return categoryMap[key];
            }
        }
        return null; // 兜底处理，防止出现未分类的题目
    }

    // 兼容旧代码的questionCategories对象
    const questionCategories = {};
    // 自动生成questionCategories对象，保持向后兼容
    allQuestions.forEach(question => {
        questionCategories[question.id] = getCategory(question.id);
    });

    const mainCategories = [
        { id: "一、基础 信息", name: "💰", questionIds: [1, 2, 3, 4, 5, 6, 7, 8] },
        { id: "二、外观 设计", name: "🎨", questionIds: [9, 10, 11, 12, 13] },
        { id: "三、内饰 设计", name: "🛋️", questionIds: [14, 15, 16, 17, 18] },
        { id: "四、动力 性能", name: "⚡", questionIds: [19, 20, 21, 22, 23] },
        { id: "五、驾驶 体验", name: "🚗", questionIds: [24, 25, 26, 27, 28, 29, 30] },
        { id: "六、操控 性能", name: "🏎️", questionIds: [31, 32, 33, 34, 35, 36] },
        { id: "七、内部 空间", name: "📏", questionIds: [37, 38, 39, 40, 41] },
        { id: "八、实用 功能", name: "🔧", questionIds: [42, 43, 44, 45, 46] },
        { id: "九、安全 配置", name: "🛡️", questionIds: [47, 48, 49, 50, 51] },
        { id: "十、科技 配置", name: "💻", questionIds: [52, 53, 54, 55, 56, 57, 58] },
        { id: "十一、舒适 配置", name: "😌", questionIds: [59, 60, 61, 62, 63] },
        { id: "十二、能耗 表现", name: "⛽", questionIds: [64, 65, 66, 67] },
        { id: "十三、维护 成本", name: "💰", questionIds: [68, 69, 70, 71, 72] },
        { id: "十四、环保 因素", name: "🌿", questionIds: [73, 74, 75, 76] },
        { id: "十五、品牌 偏好", name: "🏷️", questionIds: [77, 78, 79, 80, 81] },
        { id: "十六、市场 评价", name: "📊", questionIds: [82, 83, 84, 85, 86] },
        { id: "十七、售后 服务", name: "🛠️", questionIds: [87, 88, 89, 90, 91] },
        { id: "十八、路况 适应", name: "🛣️", questionIds: [92, 93, 94, 95] },
        { id: "十九、特殊 需求", name: "✨", questionIds: [96, 97, 98, 99, 100] },
        { id: "二十、智能 驾驶", name: "🤖", questionIds: [101, 102, 103, 104] },
        { id: "二十一、车机 系统", name: "📱", questionIds: [105, 106, 107, 108] },
        { id: "二十二、金融 因素", name: "💳", questionIds: [109, 110, 111, 112] },
        { id: "二十三、购买 决策", name: "🎯", questionIds: [113, 114, 115, 116, 117] }
    ];

    window.QUESTIONNAIRE_DATA = allQuestions;
