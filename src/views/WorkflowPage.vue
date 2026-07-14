<script setup>
import {computed,ref} from "vue";
import { useHeaderStyleScrollHandler } from "../common/headerStyleScrollHandler";
import CoverSection from "../components/workflow/CoverSection.vue";
import SideCategoryNav from "../components/workflow/SideCategoryNav.vue";
import CategoryNav from "../components/workflow/CategoryNav.vue";
import PromiseSection from "../components/about/PromiseSection.vue";
import QualitySection from "../components/about/QualitySection.vue";
import ContactSection from "../components/about/ContactSection.vue";
import StepSection from "../components/workflow/StepSection.vue";
import QuestionSection from "../components/workflow/QuestionSection.vue";

const questionList = [
    {
        title:"可以只委託設計、不委託工程嗎？",
        content:"可以。我們提供「純設計」與「設計＋工程」兩種模式，但建議仍由阜居監造，以確保圖說與現場的一致性。"
    },
    {
        title:"丈量與第一次提案會收費嗎？",
        content:"出訪會勘與第一次方向討論為免費。進入正式丈量與量身提案後，會收取丈量提案費 (後續簽約可全額抵扣)。"
    },
    {
        title:"如果中途想修改設計怎麼辦？",
        content:"在04圖說階段內可進行兩次無償修整；進入05工程簽約後，依現場條件評估，會以變更單方式進行。"
    },
    {
        title:"工程進度可以怎麼追蹤？",
        content:"每週透過LINE群組提供現場照片與週報，重點節點 (水電、防水、貼磚、完工) 由設計師親自陪同驗收。"
    }
]

const workflowList = [
    {
        id:1,
        title:"住宅空間",
        subTitle:"residential",
        steps:[
            {
                title:"現場會勘",
                subTitle:"Discover",
                content:"<p>查看屋況、業主深度訪談、瞭解預算</p>"
            },
            {
                title:"預約丈量<br/>提案",
                subTitle:"Proposal",
                content:"<p>提案內容：空間設計核心、色彩計畫、驗屋報告、平面配置圖</p><p></p><ul><li>台灣地區：丈量提案費 NTD8,000</li><li>港、澳、大陸地區：提案費 CNY3,000</li><li>其他海外地區：提案費 CNY3,000 <br/>(美金付費者，依實際匯率計算)</li></ul>"
            },
            {
                title:"簽訂設計合約",
                subTitle:"Contract",
                content:"<ul><li>台灣地區：設計費 NTD8,000/坪。設計買斷費 NTD15,000/坪</li><li>港、澳、大陸地區：CNY1,000/平米</li><li>其他海外地區：NTD15,000/坪</li></ul><p></p><p>未滿10坪/30平米 以10坪/30平米 計費。美金付費者，依實際匯率計算</p>"
            },
            {
                title:"設計圖說討論",
                subTitle:"Drawing",
                content:"<ul><li>手繪透視草圖：確認空間氛圍及配色</li><li>平面系統圖說：原始現況圖拆除圖、隔間尺寸圖、天花板圖、地材圖、水電圖、弱電圖、給排水圖、天花板燈具圖、天花板燈具迴路圖、壁面燈具圖、壁面燈具迴路圖</li><li>立面圖：立面造型、尺寸、材質型號討論</li><li>立面剖圖：櫃內尺寸、使用機能、形式、材質型號套論</li><li>3D實境模擬圖：提供渲染後空間畫面做最後討論、提供細節施工大樣圖</li></ul>"
            },
            {
                title:"材質確認",
                subTitle:"MATERIAL",
                content:"<p>實體建材體驗：質感、顏色、觸感</p>"
            },
            {
                title:"簽訂工程合約<br/>申報開工",
                subTitle:"Build & Deliver",
                content:"<p>提供詳細工程預算書、及工程進度表</p>"
            }
        ]
    },
    {
        id:2,
        title:"建築設計",
        subTitle:"architectural",
        steps:[
            {
                title:"初步會談",
                subTitle:"Discover",
                content:"<p>基地資料蒐集與調查、坪效概算、區域法規查詢、深度訪談</p>"
            },
            {
                title:"預約丈量<br/>提案",
                subTitle:"Proposal",
                content:"<p>提案內容：設計核心、色彩計畫、基地環境調查報告、區域文化背景研究、建築外觀定位、基地平面配置圖、室內平面配置圖</p><p>商用建築追加：品牌定位、企業色定位、目標客群定位、基地分析、行銷策略定位、店觀定位</p><ul><li>台灣地區：丈量提案費 NTD8,000</li><li>港、澳、大陸地區：提案費 CNY3,000</li><li>其他海外地區：提案費 CNY3,000 <br/>(美金付費者，依實際匯率計算)</li></ul>"
            },
            {
                title:"簽訂設計合約",
                subTitle:"Contract",
                content:"<ul><li>台灣地區：設計費 NTD8,000/坪。設計買斷費 NTD15,000/坪</li><li>港、澳、大陸地區：CNY1,000/平米</li><li>其他海外地區：NTD15,000/坪</li></ul><p>未滿10坪/30平米 以10坪/30平米 計費。美金付費者，依實際匯率計算</p>"
            },
            {
                title:"設計圖說討論",
                subTitle:"Drawing",
                content:"<ul><li>手繪透視草圖：確認建築外觀造型、確認空間氛圍及配色</li><li>3D 示意草圖：建築物造型、色彩搭配及材質附著後之呈現；天地壁造型、色彩搭配、以及材質於空間中呈現的氛圍；討論初步工程預算書</li></ul>"
            },
            {
                title:"基礎營造整合",
                subTitle:"Integration",
                content:"<ul><li>基礎營造整合：建築物結構探討、機電整合探討、地質探鑽調查</li><li>平面系統圖說：隔間尺寸圖、天花板圖、地材圖、水電圖、弱電圖、給排水圖、天花板燈具圖、天花板燈具迴路圖、壁面燈具圖、壁面燈具迴路圖</li></ul>"
            },
            {
                title:"執照申請",
                subTitle:"Permits",
                content:"<p>執照申請：建築執照申請、拆除執照申請（討論初步營造預算書）</p>"
            },
            {
                title:"室內設計圖說",
                subTitle:"Interiors",
                content:"<ul><li>立面系統圖說：建築外觀立面細節討論（造型、開窗位置、形式、尺寸）、室內立面圖（立面造型、尺寸、材質型號討論）、室內立面剖圖（櫃內尺寸、使用機能、形式、材質型號討論）</li><li>3D 實境環景模擬圖：提供渲染後 360 度室內空間畫面做最後討論、提供室內細節施工大樣圖、提供詳細室內工程預算書及工程進度表</li><li>實體建材體驗：質感、顏色、觸感</li></ul>"
            },
            {
                title:"簽訂工程合約<br/>申報開工",
                subTitle:"Build & Deliver",
                content:"<p>提供詳細工程預算書、及工程進度表</p>"
            }
        ]
    },
    {
        id:3,
        title:"商業空間",
        subTitle:"Commercial",
        steps:[
            {
                title:"現場會勘",
                subTitle:"Discover",
                content:"<p>查看屋況、業主深度訪談、瞭解預算</p>"
            },
            {
                title:"預約丈量<br/>提案",
                subTitle:"Proposal",
                content:"<p>提案內容空間設計核心、店觀定位、色彩計畫、 平面配置圖、3D 示意圖</p><ul><li>台灣地區：丈量提案費 NTD 20,000</li><li>港、澳、大陸地區：提案費 CNY 3,000</li><li>其他海外地區：提案費 CNY 3,000<br/>(美金付費者，依實際匯率計算)</li></ul>"
            },
            {
                title:"簽訂設計合約",
                subTitle:"Contract",
                content:"<ul><li>台灣地區：設計費 NTD8,000/坪。設計買斷費 NTD15,000/坪</li><li>港、澳、大陸地區：CNY1,000/平米</li><li>其他海外地區：NTD15,000/坪</li></ul><p>未滿10坪/30平米 以10坪/30平米 計費。美金付費者，依實際匯率計算</p><p>Logo 設計加購價：依複雜程度 NTD 50,000～100,000 之間、100,000 以上</p>"
            },
            {
                title:"3D模擬圖",
                subTitle:"Drawing",
                content:"<p>天地壁造型、色彩搭配、以及材質於空間中呈現的氛圍、討論初步工程預算書</p>"
            },
            {
                title:"設計圖說討論",
                subTitle:"Visualize",
                content:"<ul><li>平面系統圖說：原始現況圖、拆除圖、隔間尺寸圖、天花板圖、地材圖、水電圖、弱電圖、給排水圖、天花板燈具圖、天花板燈具迴路圖、壁面燈具圖、壁面燈具迴路圖</li><li>立面系統圖說：立面圖（立面造型、尺寸、材質型號討論）</li><li>其他圖說：提供細節施工大樣圖、提供詳細工程預算書及工程進度表</li></ul>"
            },
            {
                title:"材質確認",
                subTitle:"MATERIAL",
                content:"<p>實體建材體驗：質感、顏色、觸感</p>"
            },
            {
                title:"簽訂工程合約<br/>申報開工",
                subTitle:"Build & Deliver",
                content:"<p>提供詳細工程預算書、及工程進度表</p>"
            }
        ]
    }
]

const categoryList = computed(()=>{
    return workflowList.map(workflow=>{
        return {
            name: workflow.title,
            id: workflow.id,
            count: `${workflow.steps.length} STEPS`
        }
    })
})

const activeCategory = ref(0)


const headerScrollRules = [
    { selector: "#about-cover-section", style: "", offset: 0 },
    { selector: "#workflow-step-section", style: "cream", offset: 0 },
    { selector: "#about-quality-section", style: "", offset: 0 },
    { selector: "#workflow-question-section", style: "cream", offset: 0 },
    { selector: "#about-promise-section", style: "cream", offset: 0 },
    { selector: "#about-contact-section", style: "black", offset: 0 },
];

useHeaderStyleScrollHandler(headerScrollRules);
activeCategory.value = categoryList.value[0].id
</script>

<template>
    <main id="workflow-page">
        <CoverSection />

        <div class="main-container">
            <SideCategoryNav :category-list="categoryList" v-model="activeCategory" />
            <CategoryNav :category-list="categoryList" v-model="activeCategory"  />
            <StepSection :workflow-list="workflowList" :active-category="activeCategory" />

            <div class="background-box">
                <img src="/img/home/background.png" class="bg-image" />
            </div>
        </div>
        <PromiseSection />
        <QuestionSection :question-list="questionList" />

        <QualitySection/>
        <ContactSection/>
    </main>
</template>