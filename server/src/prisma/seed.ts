import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  baseURL: 'https://api.deepseek.com/v1',
});

interface Topic {
  level: string;
  type: string;
  title: string;
  prompt: string;
  examDate: string;
}

const topics: Topic[] = [
  // ================================================================
  // CET-4 Writing (2015-2025)
  // ================================================================
  // ---- 2025 ----
  { level:'CET-4', type:'writing', examDate:'2025-12', title:'Improve Student Union Work',
    prompt:'Suppose the student union is collecting opinions on improving its work for the coming year. You are to write a response by suggesting how it can better enrich student life. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2025-12', title:'Should All Students Learn Academic Writing?',
    prompt:'Suppose it is proposed that all university students should be required to learn academic writing. You are to write a response stating what you think of the proposal. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2025-12', title:'Making the Best Use of Campus Resources',
    prompt:'Suppose your university is organizing a forum on how students can make the best use of on-campus resources for academic development. You are to write an essay expressing your view. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2025-06', title:'Preparing for Future Careers',
    prompt:'As requirements for job applications are getting increasingly higher, college students ought to be better prepared for their future career. You are to write an essay continuing from this opening sentence. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2025-06', title:'Using Social Media Responsibly',
    prompt:'As social media is used more and more extensively, there is a growing awareness of the importance of using it properly and responsibly. You are to write an essay continuing from this opening sentence. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2025-06', title:'AI and Human Creativity',
    prompt:'With the increasing application of AI technology, there is a growing concern that it may negatively impact human creativity. You are to write an essay continuing from this opening sentence. You should write at least 120 words but no more than 180 words.' },
  // ---- 2024 ----
  { level:'CET-4', type:'writing', examDate:'2024-06', title:'University Libraries Open to the Public',
    prompt:'Suppose your university is conducting a survey on whether university libraries should be open to the public. You are to write an essay expressing your opinion. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2024-06', title:'University Sports Facilities Open to the Public',
    prompt:'Suppose your university is conducting a survey on whether university sports facilities should be open to the public. You are to write an essay expressing your opinion. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2024-06', title:'University Canteens Open to the Public',
    prompt:'Suppose your university is conducting a survey on whether university canteens should be open to the public. You are to write an essay expressing your opinion. You should write at least 120 words but no more than 180 words.' },
  // ---- 2023 ----
  { level:'CET-4', type:'writing', examDate:'2023-12', title:'A Campus Event That Impressed Me Most',
    prompt:'Suppose your university newspaper is inviting submissions from students for its coming edition on a campus event that has impressed them most. You are to write an essay about a campus event that impressed you most. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2023-12', title:'Recent Development of My Hometown',
    prompt:'Suppose your university newspaper is inviting submissions from students for its coming edition on the recent development of their hometown. You are to write an essay about the recent development of your hometown. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2023-12', title:'What in My University Impresses Me Most',
    prompt:'Suppose your university newspaper is inviting submissions from students for its coming edition on what in their university impresses them most. You are to write an essay. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2023-06', title:'Online Learning vs Traditional Classroom',
    prompt:'Suppose your university is conducting a survey on students\' preference between online learning and traditional classroom learning. You are to write an essay comparing the two and stating your preference. You should write at least 120 words but no more than 180 words.' },
  // ---- 2022 ----
  { level:'CET-4', type:'writing', examDate:'2022-12', title:'The Importance of Developing a Skill',
    prompt:'Suppose your university is organizing a campaign on the importance of skill development. You are to write an essay on the importance of developing a practical skill. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2022-06', title:'A Proposal for a Campus Activity',
    prompt:'Suppose your university student union is inviting proposals for new campus activities. You are to write a proposal for a campus activity that you think would benefit students. You should write at least 120 words but no more than 180 words.' },
  // ---- 2021 ----
  { level:'CET-4', type:'writing', examDate:'2021-12', title:'A Speech on Volunteering',
    prompt:'Suppose you are going to deliver a speech at a volunteering event organized by your university. You are to write a speech to encourage students to participate in volunteer activities. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2021-12', title:'A Proposal for a School Activity',
    prompt:'Suppose your university student union is organizing a campaign to enrich students\' campus life. You are to write a proposal for an activity you think would be most beneficial. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2021-06', title:'Are People Becoming Addicted to Technology?',
    prompt:'Suppose your university is conducting a survey on whether people are becoming addicted to technology. You are to write an essay expressing your opinion. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2021-06', title:'Is Technology Making People Less Sociable?',
    prompt:'Suppose your university is conducting a survey on whether technology is making people less sociable. You are to write an essay expressing your opinion. You should write at least 120 words but no more than 180 words.' },
  // ---- 2020 ----
  { level:'CET-4', type:'writing', examDate:'2020-12', title:'Changes in the Way of Transportation',
    prompt:'Suppose your university is collecting essays on the changes in our daily life. You are to write an essay on the changes in the way of transportation. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2020-12', title:'Changes in the Way of Communication',
    prompt:'Suppose your university is collecting essays on the changes in our daily life. You are to write an essay on the changes in the way of communication. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2020-12', title:'Changes in the Way of Education',
    prompt:'Suppose your university is collecting essays on the changes in our daily life. You are to write an essay on the changes in the way of education. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2020-09', title:'Online Libraries',
    prompt:'Suppose your university is conducting a survey on the use of online libraries. You are to write an essay on the advantages and disadvantages of online libraries. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2020-07', title:'The Use of Translation Apps',
    prompt:'Suppose your university is conducting a survey on the use of translation apps among students. You are to write an essay expressing your opinion on the increasing use of translation apps. You should write at least 120 words but no more than 180 words.' },
  // ---- 2019 ----
  { level:'CET-4', type:'writing', examDate:'2019-12', title:'Recommend a City to a Foreign Friend',
    prompt:'Suppose a foreign friend of yours is coming to visit China. You are to write an essay to recommend a city that you think is worth visiting. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2019-12', title:'Recommend a Way to Learn Chinese',
    prompt:'Suppose a foreign friend of yours wants to learn Chinese. You are to write an essay to recommend the best way to learn Chinese in your opinion. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2019-12', title:'Recommend a University',
    prompt:'Suppose a foreign friend of yours is considering studying in China. You are to write an essay to recommend a university for him/her. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2019-06', title:'A News Report on a Volunteer Activity',
    prompt:'Suppose you are a campus reporter. You are to write a news report on a volunteer activity organized by your university. You should write at least 120 words but no more than 180 words.' },
  // ---- 2018 ----
  { level:'CET-4', type:'writing', examDate:'2018-12', title:'The Challenges of Starting a Career After Graduation',
    prompt:'Suppose your university is collecting essays on the challenges graduates face. You are to write an essay on the challenges of starting a career after graduation. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2018-12', title:'The Challenges of Living in a Big City',
    prompt:'Suppose your university is collecting essays on the challenges graduates face. You are to write an essay on the challenges of living in a big city. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2018-12', title:'The Challenges of Studying Abroad',
    prompt:'Suppose your university is collecting essays on the challenges students face. You are to write an essay on the challenges of studying abroad. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2018-06', title:'The Importance of Writing Ability',
    prompt:'Suppose your university is organizing a forum on communication skills. You are to write an essay on the importance of writing ability. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2018-06', title:'The Importance of Reading Ability',
    prompt:'Suppose your university is organizing a forum on communication skills. You are to write an essay on the importance of reading ability. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2018-06', title:'The Importance of Speaking Ability',
    prompt:'Suppose your university is organizing a forum on communication skills. You are to write an essay on the importance of speaking ability. You should write at least 120 words but no more than 180 words.' },
  // ---- 2017 ----
  { level:'CET-4', type:'writing', examDate:'2017-12', title:'How to Handle the Relationship Between Parents and Children',
    prompt:'Suppose you are to write an essay on how to best handle the relationship between parents and children. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2017-12', title:'How to Handle the Relationship Between Teachers and Students',
    prompt:'Suppose you are to write an essay on how to best handle the relationship between teachers and students. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2017-06', title:'Advertisement: Selling a Used Bike',
    prompt:'Suppose you are going to graduate and want to sell your used bike. You are to write an advertisement to post on your campus website. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2017-06', title:'Advertisement: Selling a Used Computer',
    prompt:'Suppose you are going to graduate and want to sell your used computer. You are to write an advertisement to post on your campus website. You should write at least 120 words but no more than 180 words.' },
  // ---- 2016 ----
  { level:'CET-4', type:'writing', examDate:'2016-12', title:'Choices After Graduation: Working for a State-owned Business',
    prompt:'Suppose you are to write an essay on your choice after graduation. You are to write about working for a state-owned business vs other options. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2016-12', title:'Choices After Graduation: Starting Your Own Business',
    prompt:'Suppose you are to write an essay on your choice after graduation. You are to write about starting your own business vs other options. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2016-06', title:'A Letter of Thanks to Parents',
    prompt:'Suppose you are to write a letter to express your gratitude to your parents. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2016-06', title:'A Letter of Thanks to a Teacher',
    prompt:'Suppose you are to write a letter to express your gratitude to a teacher who has helped you most. You should write at least 120 words but no more than 180 words.' },
  // ---- 2015 ----
  { level:'CET-4', type:'writing', examDate:'2015-12', title:'The Importance of Lifelong Learning',
    prompt:'Suppose your university is organizing a forum on education. You are to write an essay on the importance of lifelong learning. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2015-12', title:'Listening Is More Important Than Talking',
    prompt:'Suppose you are to write an essay to explain why listening is more important than talking in communication. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2015-06', title:'The Most Impressive Classmate',
    prompt:'Suppose you are to write an essay about the most impressive classmate you have ever had. You should write at least 120 words but no more than 180 words.' },
  { level:'CET-4', type:'writing', examDate:'2015-06', title:'How I Finance My College Education',
    prompt:'Suppose you are to write an essay on how you finance your college education. You should write at least 120 words but no more than 180 words.' },

  // ================================================================
  // CET-6 Writing (2015-2025)
  // ================================================================
  // ---- 2025 ----
  { level:'CET-6', type:'writing', examDate:'2025-12', title:'Teachers\' Influence on Students',
    prompt:'For this part, you are allowed 30 minutes to write an essay on teachers\' influence on students\' academic pursuit and personal development. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2025-12', title:'Realizing the Chinese Dream: Our Role',
    prompt:'For this part, you are allowed 30 minutes to write an essay on realizing the Chinese Dream and what role university students should play. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2025-12', title:'Prepare for Upcoming Challenges',
    prompt:'For this part, you are allowed 30 minutes to write an essay on how university students should prepare well for upcoming challenges in their academic and personal life. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2025-06', title:'Cross-cultural Communication Abilities',
    prompt:'Suppose your university is organizing a forum on the development of students\' cross-cultural communication abilities. You are now to write an essay to express your view. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2025-06', title:'Should College Chinese Be a Compulsory Course?',
    prompt:'Suppose your university is seeking students\' opinions on the necessity of making College Chinese a compulsory course. You are now to write an essay to express your view. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2025-06', title:'Appropriate Use of AI in Learning',
    prompt:'Suppose your university is conducting a survey to collect students\' opinions on the appropriate use of AI technology in assisting learning. You are now to write an essay to express your view. You should write at least 150 words but no more than 200 words.' },
  // ---- 2024 ----
  { level:'CET-6', type:'writing', examDate:'2024-06', title:'AI and Human Creativity',
    prompt:'For this part, you are allowed 30 minutes to write an essay on whether artificial intelligence poses a threat to human creativity. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2024-06', title:'Career Preparation in College',
    prompt:'For this part, you are allowed 30 minutes to write an essay on how college students should prepare for their future careers. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2024-06', title:'Digital Literacy in the Modern Era',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of digital literacy for college students. You should write at least 150 words but no more than 200 words.' },
  // ---- 2023 ----
  { level:'CET-6', type:'writing', examDate:'2023-12', title:'Will AI Replace Human Jobs?',
    prompt:'For this part, you are allowed 30 minutes to write an essay on whether artificial intelligence will replace human jobs. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2023-12', title:'The Impact of AI on Learning',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the impact of artificial intelligence on students\' learning. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2023-06', title:'The Importance of Learning Basic Skills',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of learning basic skills in the modern world. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2023-06', title:'Cultivating a Sense of Social Responsibility',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of cultivating a sense of social responsibility among college students. You should write at least 150 words but no more than 200 words.' },
  // ---- 2022 ----
  { level:'CET-6', type:'writing', examDate:'2022-12', title:'Balance Between Study and Leisure',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of maintaining a balance between study and leisure. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2022-12', title:'The Importance of a Positive Attitude',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of maintaining a positive attitude when facing difficulties. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2022-06', title:'The Importance of Critical Thinking',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of cultivating critical thinking skills. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2022-06', title:'The Importance of Mutual Understanding',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of mutual understanding in interpersonal relationships. You should write at least 150 words but no more than 200 words.' },
  // ---- 2021 ----
  { level:'CET-6', type:'writing', examDate:'2021-12', title:'Developing a Healthy Lifestyle',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of developing a healthy lifestyle among college students. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2021-06', title:'Technology and Independent Thinking',
    prompt:'For this part, you are allowed 30 minutes to write an essay on whether technology will make people lose the ability to think independently. You should write at least 150 words but no more than 200 words.' },
  // ---- 2020 ----
  { level:'CET-6', type:'writing', examDate:'2020-12', title:'The Ability to Meet Challenges',
    prompt:'For this part, you are allowed 30 minutes to write an essay on why students should be encouraged to develop the ability to meet challenges. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2020-12', title:'Developing Effective Communication Skills',
    prompt:'For this part, you are allowed 30 minutes to write an essay on why students should be encouraged to develop effective communication skills. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2020-09', title:'The Importance of Cultivating a Hobby',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of cultivating a hobby. You should write at least 150 words but no more than 200 words.' },
  // ---- 2019 ----
  { level:'CET-6', type:'writing', examDate:'2019-12', title:'The Importance of Having a Sense of Social Responsibility',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of having a sense of social responsibility. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2019-12', title:'The Importance of Having a Sense of Family Responsibility',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of having a sense of family responsibility. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2019-06', title:'The Importance of Mutual Understanding and Respect',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of mutual understanding and respect in interpersonal relationships. You should write at least 150 words but no more than 200 words.' },
  // ---- 2018 ----
  { level:'CET-6', type:'writing', examDate:'2018-12', title:'How to Balance Work and Leisure',
    prompt:'For this part, you are allowed 30 minutes to write an essay on how to best balance work and leisure in modern society. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2018-06', title:'The Importance of Building Trust Between Employers and Employees',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of building trust between employers and employees. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2018-06', title:'The Importance of Building Trust Between Teachers and Students',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of building trust between teachers and students. You should write at least 150 words but no more than 200 words.' },
  // ---- 2017 ----
  { level:'CET-6', type:'writing', examDate:'2017-12', title:'Respect Others, and You Will Be Respected',
    prompt:'For this part, you are allowed 30 minutes to write an essay commenting on the saying "Respect others, and you will be respected." You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2017-12', title:'Seek to Understand Others, and You Will Be Understood',
    prompt:'For this part, you are allowed 30 minutes to write an essay commenting on the saying "Seek to understand others, and you will be understood." You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2017-06', title:'Whether to Major in Science or Humanities',
    prompt:'Suppose you are to choose between majoring in science or humanities. You are to write an essay stating your choice and explaining why. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2017-06', title:'Whether to Study Abroad After Graduation',
    prompt:'Suppose you are to decide whether to study abroad after graduation. You are to write an essay stating your decision and explaining why. You should write at least 150 words but no more than 200 words.' },
  // ---- 2016 ----
  { level:'CET-6', type:'writing', examDate:'2016-12', title:'Innovation and Tradition',
    prompt:'For this part, you are allowed 30 minutes to write an essay on how to best handle the relationship between innovation and tradition. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2016-06', title:'The Impact of Virtual Reality on Our Lives',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the impact of virtual reality on our lives. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2016-06', title:'The Importance of E-books',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of e-books in the digital age. You should write at least 150 words but no more than 200 words.' },
  // ---- 2015 ----
  { level:'CET-6', type:'writing', examDate:'2015-12', title:'The Importance of Reading Classics',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of reading classic literature. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2015-12', title:'Being a Well-rounded Person',
    prompt:'For this part, you are allowed 30 minutes to write an essay on the importance of being a well-rounded person. You should write at least 150 words but no more than 200 words.' },
  { level:'CET-6', type:'writing', examDate:'2015-06', title:'Knowledge Is a Treasure, but Practice Is the Key to It',
    prompt:'For this part, you are allowed 30 minutes to write an essay commenting on the saying "Knowledge is a treasure, but practice is the key to it." You should write at least 150 words but no more than 200 words.' },

  // ================================================================
  // CET-4 Translation (2015-2025)
  // ================================================================
  // ---- 2025 ----
  { level:'CET-4', type:'translation', examDate:'2025-12', title:'Private Economy in China',
    prompt:'中国政府高度重视民营经济发展，出台了一系列支持政策。截至2025年3月底，全国民营企业数量超过5700万家，占企业总量的92.3%。民营企业在技术创新方面投入不断增加，在新一代信息技术、人工智能等前沿领域发展迅速，成为中国经济增长的重要引擎。' },
  { level:'CET-4', type:'translation', examDate:'2025-12', title:'Frugality — A Traditional Virtue',
    prompt:'节俭是中华民族的传统美德，深深植根于中国人的日常生活之中。大多数中国人仍然坚持节俭的生活方式，这种生活方式体现了理性消费的理念和对劳动的尊重。从节约粮食到减少浪费，节俭精神贯穿于中国人的衣食住行各个方面。' },
  { level:'CET-4', type:'translation', examDate:'2025-06', title:'Hybrid Rice',
    prompt:'袁隆平被誉为"杂交水稻之父"。他和他的团队经过多年努力，成功研发出了超级杂交水稻。这种水稻不仅抗旱抗病能力更强，而且产量比普通水稻提高了20%至30%。杂交水稻营养丰富、口感更佳，为解决全球粮食安全问题做出了重大贡献。' },
  { level:'CET-4', type:'translation', examDate:'2025-06', title:'Ice and Snow World',
    prompt:'中国东北地区充分利用其得天独厚的冰雪资源，大力发展冰雪旅游产业。哈尔滨建成了举世闻名的冰雪大世界，游客在这里不仅可以欣赏冰雪之美，还能体验独特的东北民俗文化。冰天雪地正吸引着来自四面八方的游客，成为热门的旅游胜地。' },
  { level:'CET-4', type:'translation', examDate:'2025-06', title:'15-Minute Community Life Circle',
    prompt:'近年来，中国许多城市着力打造"15分钟便民生活圈"。在这一生活圈内，居民步行15分钟即可获得基本的公共服务。圈内配备了便利店、公园、健身设施、图书馆、学校、食堂和社区诊所等，极大提升了居民的生活质量和幸福感。' },
  // ---- 2023-2024 ----
  { level:'CET-4', type:'translation', examDate:'2024-06', title:'Education Without Discrimination',
    prompt:'"有教无类"是中国古代著名教育家孔子提出的教育理念，意思是每个人都有平等接受教育的权利，教育不应该因为学生的出身、贫富或天资不同而有所区别。这一理念对中国几千年的教育产生了深远影响，至今仍具有重要的现实意义。' },
  { level:'CET-4', type:'translation', examDate:'2023-12', title:'The Spring Festival',
    prompt:'春节是中国最重要的传统节日，也是中国人一年中最隆重的节日。除夕之夜，全家人会聚在一起吃年夜饭，这是一年中最重要的一顿饭。春节期间，人们会贴春联、放鞭炮、看春晚。孩子们还会收到长辈给的红包，也就是压岁钱。春节不仅是家人团聚的时刻，也承载着人们对新一年的美好期盼。' },
  { level:'CET-4', type:'translation', examDate:'2023-06', title:'China\'s High-Speed Rail',
    prompt:'中国高铁是中国交通领域的一项重大成就。截至2022年底，中国高铁运营里程已超过4.2万公里，位居世界第一。高铁不仅缩短了城市间的时空距离，也极大地促进了沿线地区的经济发展。许多外国游客来到中国后，都会被中国高铁的便捷和舒适所震撼。' },
  // ---- 2021-2022 ----
  { level:'CET-4', type:'translation', examDate:'2022-12', title:'Taijiquan (Tai Chi)',
    prompt:'太极拳是中国传统武术的一种，也是深受人们喜爱的健身方式。它动作缓慢、柔和，讲究呼吸调节和冥想。练习太极拳不仅能够增强体质，还能缓解压力、改善心理健康。如今，太极拳已经传播到世界各地，成为中国文化的一张亮丽名片。' },
  { level:'CET-4', type:'translation', examDate:'2022-06', title:'Digital Economy',
    prompt:'近年来，中国的数字经济发展迅速，已成为推动经济增长的重要引擎。数字经济不仅促进了传统产业的转型升级，也在教育、医疗、交通等领域得到了广泛应用。越来越多的中国人习惯了移动支付和在线购物，数字经济正在深刻改变人们的生活方式。' },
  { level:'CET-4', type:'translation', examDate:'2021-12', title:'Chinese Tea Culture',
    prompt:'中国是茶的故乡，有着四千多年的茶文化历史。中国人不仅喜欢喝茶，也讲究品茶。茶在中国人的日常生活中占据着重要地位，无论是招待客人还是家庭聚会，茶都是必不可少的。此外，茶还具有多种保健功效，如提神醒脑、帮助消化等。' },
  { level:'CET-4', type:'translation', examDate:'2021-06', title:'Traditional Chinese Hospitality',
    prompt:'中国素有"礼仪之邦"的美称，中国人民热情好客的传统由来已久。当客人来访时，主人会到门口迎接，请客人先进屋。主人会为客人准备茶水和点心，并在客人离开时送至门口甚至更远的地方。这种待客之道体现了中国文化的核心价值观，即尊重他人和以和为贵。' },
  { level:'CET-4', type:'translation', examDate:'2020-12', title:'The Qinghai-Tibet Railway',
    prompt:'青藏铁路是世界上最高、最长的高原铁路，被称为"天路"。它连接青海省西宁市和西藏自治区拉萨市，全长1956公里。青藏铁路的建设克服了高原缺氧、冻土等世界级难题，是中国铁路建设史上的奇迹。它的建成通车极大地促进了西藏的经济社会发展和民族团结。' },
  // ---- 2018-2019 ----
  { level:'CET-4', type:'translation', examDate:'2019-12', title:'Chinese Family Values',
    prompt:'中国的家庭观念源远流长，家庭在中国社会中一直占据着核心地位。中国人重视孝道，尊敬长辈是中华民族的传统美德。逢年过节，无论身处多远，人们都会想方设法回到家乡和家人团聚。这种强烈的家庭观念不仅是社会稳定和谐的基石，也深刻影响着中国人的生活方式。' },
  { level:'CET-4', type:'translation', examDate:'2019-06', title:'Paper Cutting',
    prompt:'剪纸是中国最古老的民间艺术之一，距今已有1500多年的历史。每逢春节或喜庆日子，人们会将精美的剪纸贴在窗户上，寓意吉祥如意。剪纸的内容大多取材于日常生活，如花鸟鱼虫、人物故事等。如今，剪纸已被列入联合国教科文组织非物质文化遗产名录。' },
  { level:'CET-4', type:'translation', examDate:'2019-06', title:'The Lantern Festival',
    prompt:'元宵节是中国传统节日，也是春节庆祝活动的压轴大戏。这一天，人们会吃元宵或汤圆，象征家庭团圆、生活甜蜜。夜晚，大街小巷挂满各式各样的花灯，人们赏灯猜灯谜，热闹非凡。元宵节已有两千多年的历史，是中华民族重要的文化遗产。' },
  { level:'CET-4', type:'translation', examDate:'2018-12', title:'Mobile Payment in China',
    prompt:'近年来，移动支付在中国得到了迅速普及。如今，无论是在大型商场还是在街头小摊，人们都可以用手机扫二维码完成支付。移动支付不仅方便快捷，还减少了现金使用的风险。许多外国游客来到中国后，都对这种支付方式感到惊讶和赞叹。' },
  // ---- 2016-2017 ----
  { level:'CET-4', type:'translation', examDate:'2017-12', title:'Mount Tai',
    prompt:'泰山位于山东省，是中国五岳之首，素有"天下第一山"之称。自古以来，泰山就是中国历代帝王封禅祭天的地方，也是文人墨客吟诗作画的重要题材。泰山的雄伟壮丽和深厚的文化底蕴吸引了无数中外游客前来观光。1987年，泰山被联合国教科文组织列入世界文化与自然遗产名录。' },
  { level:'CET-4', type:'translation', examDate:'2017-06', title:'The Yellow River',
    prompt:'黄河是中国第二长河，全长约5464公里，流经九个省区。它被誉为中华民族的母亲河，是中华文明的发源地。黄河流域孕育了灿烂的农业文明和华夏文化。然而，黄河也曾因洪水泛滥而被称为"中国的忧患"。如今，通过综合治理，黄河正在变成一条造福人民的河流。' },
  { level:'CET-4', type:'translation', examDate:'2016-12', title:'Colors in Chinese Culture: Red',
    prompt:'红色在中国文化中象征着吉祥、喜庆和幸福。在中国传统婚礼上，新娘穿红色嫁衣，亲友送红包；春节期间，家家户户贴红色春联和窗花。红色还代表着革命精神和爱国情怀，中国国旗就是红色的。可以说，红色是中国人最喜爱、最具代表性的颜色。' },
  { level:'CET-4', type:'translation', examDate:'2016-06', title:'Chinese Kung Fu',
    prompt:'中国功夫，又称武术，是中华民族宝贵的文化遗产。它不仅是格斗技巧，更是一种融合了哲学、道德和艺术的综合性文化体系。练习功夫可以强身健体、磨炼意志。近年来，通过电影和表演，中国功夫已经传遍世界各地，成为中国文化走向世界的重要桥梁。' },
  // ---- 2015 ----
  { level:'CET-4', type:'translation', examDate:'2015-12', title:'Chinese Food Culture',
    prompt:'中国饮食文化博大精深、源远流长。中国菜讲究色、香、味、形的和谐统一。由于地域辽阔，中国各地形成了各具特色的菜系，如川菜的麻辣、粤菜的清淡、鲁菜的咸鲜等。中国人认为饮食不仅是为了果腹，更是一种生活的享受和文化的体现。' },

  // ================================================================
  // CET-6 Translation (2015-2025)
  // ================================================================
  // ---- 2025 ----
  { level:'CET-6', type:'translation', examDate:'2025-12', title:'Respecting the Elderly',
    prompt:'尊老是中华民族的传统美德，深深植根于中国人的思想和日常行为之中。自古以来，中国人就讲究孝道，"老吾老以及人之老"是社会普遍遵守的道德准则。如今，社会各界积极营造敬老助老的氛围，社区开设长者食堂，公共场所配置老年人优先座位，政府也出台了一系列保障老年人权益的政策法规。' },
  { level:'CET-6', type:'translation', examDate:'2025-12', title:'Harmony Between Man and Nature',
    prompt:'"天人合一"是中国传统哲学的核心思想之一，强调人与自然应当和谐共生。这一理念深深影响了中国的建筑、园林、书画和生活方式。今天，在应对全球气候变化和环境问题的大背景下，"天人合一"的古老智慧正焕发出新的时代意义，为可持续发展提供了东方智慧和中国方案。' },
  { level:'CET-6', type:'translation', examDate:'2025-06', title:'South-to-North Water Diversion',
    prompt:'自古以来，中国水资源就呈现北缺南丰、分布极不均衡的特点。为解决北方地区的水资源短缺问题，中国政府实施了南水北调工程。该工程历经数十年规划和筹备，于2002年正式开工，规划了东、中、西三条调水线路，总长度达4350公里，惠及人口超过4亿。自2014年通水以来，已累计调水超过500亿立方米。' },
  // ---- 2022-2024 ----
  { level:'CET-6', type:'translation', examDate:'2024-06', title:'Bamboo Culture',
    prompt:'竹子在中国文化中有着独特的地位。它四季常青，象征着坚韧不拔的品格。中国文人历来喜爱竹子，将其与梅、兰、菊并称为"四君子"。竹子在中国人的日常生活中也随处可见，从筷子到家具，从纸张到建筑材料，竹子的用途十分广泛。' },
  { level:'CET-6', type:'translation', examDate:'2022-12', title:'The Loess Plateau',
    prompt:'黄土高原位于中国中部偏北，面积约60万平方公里。这里是世界上黄土分布最集中、覆盖面积最大的地区。黄土高原是中华民族的发祥地之一，孕育了灿烂的中华文明。近年来，中国政府实施西部大开发战略，黄土高原地区的生态环境得到了显著改善。' },
  { level:'CET-6', type:'translation', examDate:'2022-06', title:'Zhaozhou Bridge',
    prompt:'赵州桥位于河北省赵县，建于隋代，距今已有1400多年的历史。它由著名工匠李春设计和建造，是世界上现存最早、保存最完好的石拱桥。赵州桥的设计巧妙、结构坚固，充分展示了中国古代桥梁建筑的高超技艺，被誉为"天下第一桥"。' },
  { level:'CET-6', type:'translation', examDate:'2021-12', title:'Revolutionary Base Areas: Jinggangshan',
    prompt:'井冈山是中国革命的摇篮。1927年，毛泽东等老一辈革命家在这里创建了中国第一个农村革命根据地，开辟了农村包围城市、武装夺取政权的革命道路。井冈山精神，即坚定信念、艰苦奋斗、实事求是、敢闯新路，至今仍是激励中国人民前进的宝贵精神财富。' },
  { level:'CET-6', type:'translation', examDate:'2021-06', title:'Hainan Province',
    prompt:'海南是中国最南端的省份，也是中国唯一的热带岛屿省份。海南拥有得天独厚的自然资源，阳光、沙滩、海水、椰林吸引了大量中外游客。近年来，海南自由贸易港建设取得了显著进展，正逐步成为面向太平洋和印度洋的重要开放门户。' },
  // ---- 2018-2020 ----
  { level:'CET-6', type:'translation', examDate:'2019-12', title:'Chinese Calligraphy',
    prompt:'中国书法是一门古老的艺术，已有数千年的历史。它不仅是书写汉字的技巧，更是一种表达个人情感和修养的艺术形式。书法讲究笔法、结构和章法，有篆书、隶书、楷书、行书、草书等多种字体。历代书法名家的作品被视为珍贵的文化遗产，对后世影响深远。' },
  { level:'CET-6', type:'translation', examDate:'2019-06', title:'Chinese Dialects',
    prompt:'中国幅员辽阔，人口众多，形成了丰富多彩的方言体系。汉语方言大致可分为七大方言区，各方言在语音、词汇和语法上各有特色。方言不仅是交流的工具，更是地域文化的重要载体。然而，随着普通话的推广和城市化进程的加快，一些方言正面临消失的危险。' },
  { level:'CET-6', type:'translation', examDate:'2018-12', title:'The Silk Road',
    prompt:'丝绸之路是古代连接东西方的重要贸易通道，以丝绸贸易而得名。它不仅是商品交换的通道，更是东西方文明交流的桥梁。通过丝绸之路，中国的四大发明传播到了西方，而佛教等外来文化也传入了中国。如今，中国提出的"一带一路"倡议使古老的丝绸之路焕发出新的生机。' },
  { level:'CET-6', type:'translation', examDate:'2018-06', title:'Peking Opera',
    prompt:'京剧是中国最具代表性的传统戏曲形式，被誉为"国粹"。它融合了唱、念、做、打等多种表演方式，演员通过独特的脸谱和服饰展示人物的性格特点。京剧已有200多年的历史，2010年被联合国教科文组织列入人类非物质文化遗产代表作名录。' },
  // ---- 2016-2017 ----
  { level:'CET-6', type:'translation', examDate:'2017-12', title:'The Qinghai-Tibet Plateau',
    prompt:'青藏高原是世界上最高的高原，平均海拔超过4000米，被称为"世界屋脊"。它是长江、黄河、澜沧江等众多大江大河的发源地，素有"亚洲水塔"之称。青藏高原独特的自然环境和丰富的生物多样性使其在全球生态系统中占有至关重要的地位。' },
  { level:'CET-6', type:'translation', examDate:'2017-06', title:'Tang Poetry',
    prompt:'唐诗是中国古典文学的巅峰之作，流传至今的有近五万首。李白、杜甫、白居易等唐代诗人的作品，以其优美的语言和深邃的思想影响了中国乃至世界文学。唐诗题材广泛，涵盖山水田园、边塞战争、爱情友谊等各个方面，是了解中国传统文化的重要窗口。' },
  { level:'CET-6', type:'translation', examDate:'2016-12', title:'Traditional Chinese Medicine',
    prompt:'中医是中国传统文化的瑰宝，有着数千年的历史。中医注重整体观念和辨证论治，认为人体是一个有机的整体，疾病是人体内部及人与自然环境之间失衡的结果。中药、针灸、推拿等中医治疗手段因其疗效显著、副作用小而越来越受到世界的关注。' },
  { level:'CET-6', type:'translation', examDate:'2015-12', title:'Chinese Acupuncture',
    prompt:'针灸是中医学的重要组成部分，距今已有两千多年的历史。它通过在人体特定穴位刺入细针来调节气血运行，达到治疗疾病的目的。针灸具有疗效确切、操作简便、成本低廉等优点。2010年，联合国教科文组织将中医针灸列入人类非物质文化遗产代表作名录。' },

  // ================================================================
  // ================================================================
  // TEM-8 Writing (2016-2025, Real Exam Materials)
  // ================================================================
  { level:'TEM-8', type:'writing', examDate:'2025-04', title:'Humility and Ambition',
    prompt:'Read carefully the following two excerpts on humility and ambition, and then write your response in NO LESS THAN 300 WORDS, in which you should:\n1. summarize the main message of the two excerpts, and then\n2. give your opinions on how to balance humility with ambition in your future career development.\n\nExcerpt 1: What is humility associated with?\nHumility is considered by many philosophers a core element of virtue, which has important benefits to the individual and society. Humility is associated with avoiding conflict, fostering reconciliation, acceptance, and peaceful coexistence. We generally perceive humility as a positive trait, and even feel naturally drawn to humble individuals. Humility is also associated with personal happiness. Humble people generally have a great appreciation for living and for day-to-day experiences, and they are often family- and relationship-oriented. The call for humility is likely grounded in the observation that humility is associated with appreciation of life and interpersonal relationships. Living a simple life and being down-to-earth not only give you a good social life. They also help you earn the respect of other people.\n\nExcerpt 2: Humility and ambition\nThere has been a remarkable conflict between the call for humility and the societal value system that rewards competitiveness and prominence. General wisdom is that it\'s harder to advance our career when we humbly stand back instead of promoting ourselves. Humility is frequently perceived as a weakness. Therefore, we tend to spend most of our lives working to achieve the opposite of humility — we strive for recognition. We don\'t want to be like others — we want to be better. There is barely a moment in our lives when we are not confronted with some kind of yearning or need.' },
  { level:'TEM-8', type:'writing', examDate:'2024-04', title:'Online Learning vs Traditional Teaching',
    prompt:'Read carefully the following two excerpts on online learning, and then write your response in NO LESS THAN 300 WORDS, in which you should:\n1. summarize the main messages of the two excerpts, and then\n2. comment on Professor Smith\'s opinion, using poor online learning experience as an example.\n\nExcerpt 1: The Convenience of Online Learning\nWith the widespread use of the computer and the smartphone, an increasing number of people tend to use the Internet to get information and acquire knowledge, which is quite convenient. However, about ten to twenty years ago, when people wanted to learn a language, they had to endure hours of school lessons or evening classes, with their heads buried in textbooks. Nowadays, technology appears to be providing a better and more accessible way of learning languages. Having a smartphone means you can have a virtual teacher with you wherever you go. One of the many popular APPs offers 91 courses in 30 languages and has more than 300 million users. Whatever you want to learn, language-learning APPs allow you to go at your own pace and fit learning around other commitments. Many schools in China have adopted online platforms to teach classes. In most cases, these platforms employ adaptive learning techniques which customize the learning experience based on each student\'s needs, interests, and learning styles. This personalized approach convinces people of the effectiveness of online learning.\n\nExcerpt 2: Problems Concerning Online Education\nTechnology has accelerated the wide spread of online education, which appears to be more accessible and more convenient compared with traditional education. However, there are also problems concerning online education. Some people may ask, for example, how can one learn subjects such as chemistry without being able to use the laboratory equipment, how can one learn a language without face-to-face interaction involving gestures, facial expressions, body postures, and how can one meet extra-curricular requirements, such as forming good habits, upholding social norms and keeping high standards of discipline if they are stuck behind a computer monitor? There are many issues that need to be addressed if online education is to thrive. Professor Smith, department head of modern languages at River University, argues that technology never spells the end of traditional classrooms and teachers. She says that teaching APPs should be used alongside conventional classroom methods, not to the exclusion of traditional teaching. And she adds, "The APPs are not designed for degrees, but they could be additional resources."' },
  { level:'TEM-8', type:'writing', examDate:'2023-04', title:'Swimming Requirements for University Graduation',
    prompt:'Read carefully the following two excerpts on swimming requirements for university students, and then write your response in NO LESS THAN 300 WORDS, in which you should:\n1. summarize the main message of the two excerpts, and then\n2. make comments on whether universities should set requirements other than academic achievements for students to graduate.\n\nExcerpt 1: Sink or swim tied to bachelor\'s degrees — literally\nStudents hoping to enter one of the top universities in China this year had better be able to swim or be prepared to learn swimming and pass a swim test since this university will not grant bachelor\'s degrees if they cannot swim. In September, would-be freshmen at the university will have to take swimming courses if they fail a swimming test at the beginning of their university life. And they won\'t receive their degrees if they cannot swim before their graduation, in accordance with a message at a university staff meeting days ago, a local newspaper reported on Monday. As to why the university is linking swimming ability with degrees, "as a requisite survival skill, swimming is beneficial for students in the long run, since swimming is helpful in improving students\' endurance and doing less harm to joints and muscles as a water sport," said head of the Division of Sports Science and Physical Education. Viewing the ability to swim as a must for students to earn their degrees is not new in this top university, as this ability was listed on its school regulations in the early 20th century.\n\nExcerpt 2: University of Chicago nixes nearly 60-year-old swim requirements\nFor almost 60 years, one of the first things new students had to prove at the University of Chicago was their ability to stay afloat. But students in the Class of 2016 wouldn\'t have to pass a swim test or take a swimming course in their freshman year. The University of Chicago has joined other universities in nixing the requirement. A handful of universities still require swimming tests to graduate, a dramatic shift considering that in 1977, 42 percent of colleges had some sort of swimming requirement, the Associated Press reported in 2006. By 1982 that figure had plummeted to 8 percent, and today, there are just a handful. Jeremy Manier, a university spokesman, said the reason for the change was to give students options in how they choose to exercise. Many University of Chicago students agree with the change. In his opinion, the swim test was outdated. "There\'s that fringe sect of universities that say it\'s a valuable life skill, but then again, so is self defense," Foster said. "So I think it\'s a smart decision to really leave it up to the students to decide when, if at all, they would like to take the time to learn that skill."' },
  { level:'TEM-8', type:'writing', examDate:'2022-04', title:'Happiness and Stoic Philosophy',
    prompt:'Read carefully the following two excerpts on happiness, and then write your response in NO LESS THAN 300 WORDS, in which you should:\n1. summarize the main message of the two excerpts, and then\n2. express your own opinion on the two approaches to happiness.\n\nExcerpt 1: Stoicism — It\'s not things that upset us, but how we think about things\nStoicism holds that the key to a good, happy life is the cultivation of an excellent mental state, which the Stoics identified with virtue and being rational. Two fundamental principles can both be found in the Handbook, a short work summarizing the ideas of Epictetus. The first is that some things are within our control and some are not, and that much of our unhappiness is caused by thinking that we can control things that, in fact, we can\'t. What can we control? Epictetus argues that we actually control very little. We don\'t control what happens to us, we can\'t control what the people around us say or do, and we can\'t even fully control our own bodies, which get damaged and sick and ultimately die without regard for our preferences. The only thing that we really control is how we think about things, the judgments we make about things. This leads us to the second fundamental principle: it\'s not things that upset us, but how we think about things. Things happen. We then make judgments about what happens. If we judge that something really bad has happened, then we might get upset, sad, or angry, depending on what it is.\n\nExcerpt 2: Happiness comes from correctly managing the world around you\nThere are not many things we have complete control over in this world. However, our mind is potentially one of them. Barring your thoughts, emotions, process and resulting actions are completely under your control. Training your mind is an essential skill, like learning to walk. However, not many people are showing us how. You need to become a master of your own mind. And in your mind, you can change how you think. You can eliminate negativity, see solutions over problems, and connect with people. It takes work, failure, and repeated conditioning. Conquer your body: Your body is simply an incredible tool to help you experience the world. You don\'t have to be a peak athlete or a fitness trainer. You do have to provide your body with quality food and exercise. It was originally so simple, because that is what we were made to do. You ate, you moved, and you were filled with unlimited energy. Unfortunately, our society has made it difficult. We\'ve become addicted to short-term rewards and fast-food drugs that make daily healthy living uncomfortable. Break free from that, and be human again.' },
  { level:'TEM-8', type:'writing', examDate:'2021-04', title:'Private Tutoring: Promote or Prohibit?',
    prompt:'Read carefully the following two excerpts on private tutoring, and then write your response in NO LESS THAN 300 WORDS in which you should:\n1. summarize the main messages in the two excerpts, and then\n2. express your opinion on the issue, especially on whether private tutoring should be promoted or prohibited.\n\nExcerpt 1: Why Tutoring is Important\nNot every child learns the same way. Some children learn faster than others. Luckily, for any student who falls a little behind or has trouble in a particular subject there is tutoring available to help them. Some parents believe their child does not need tutoring help, but many others may prefer instead to have their child receive some extra help after class. In our educational center, we believe that tutoring is very important in the world of academics. Honestly, there is certainly no shame that your child may need a tutor. No matter what subject your child needs help in, we can design a tailored program that suits your child\'s needs. Whether it is Math, English, Reading, or Study Skills, there is always a tutor available to help you and your child. Frequently there are times that a child starts to learn something new in school, only to get frustrated that they are having difficulty in understanding the basic concepts. If they do not learn the fundamental concepts well, it will only cause the child more difficulty when trying to complete homework assignments and ultimately trouble scoring well on exams.\n\nExcerpt 2: Private Home Tuition Illegal\nThe Supreme Education Council (SEC) is to launch a crackdown against private tuition from the second semester of the current academic year. According to the local daily, the campaign will prohibit private lessons and the promotion of the "phenomenon" with heavy penalties for people who would violate the rules. The daily, quoting Mr. Muhammadi, head of the Communication Office at the SEC, said the penalties for offenders could be imprisonment up to six months and heavy fines or both. Officers of the SEC will have the judicial authority to deal with any offence in this regard. Mr. Muhammadi said measures are being taken in order to implement the new law, which was issued last September, for practicing of educational services in the country. He urged publishing houses and advertisement platforms to participate in the campaign by refusing to release any material that promotes and encourages private tuition. To curb the "unhealthy" practice, awareness campaigns through different media will be run to inform the residents about the new law, he said.' },
  { level:'TEM-8', type:'writing', examDate:'2019-03', title:'Consumption: Consequences or Path to Cultivation?',
    prompt:'Read carefully the following two excerpts on consumption, and then write your response in NO LESS THAN 300 WORDS, in which you should:\n1. summarize the main message of the two excerpts, and then\n2. comment on the role of consumption in human society, especially on whether consumption may lead to desirable or undesirable results.\n\nExcerpt 1: Consequences of consumerism\nIn Human Development Report 1998 Overview by the United Nations Development Program (UNDP), "World consumption has expanded at an unprecedented pace over the 20th century, with private and public consumption expenditures reaching $24 trillion in 1998, twice the level of 1975 and six times that of 1950. In 1990 real consumption expenditure was barely $1.5 trillion." In September 2001, the BBC aired a documentary called "Shopology," where psychologists looked into the psychology of shopping and consumerism in countries like Britain, USA and Japan and asked if it was healthy for consumers. Of the many points they raised, they observed that: Consumption now helps to define who we are; We essentially "buy" a lifestyle; Consumerism can increase stress for various reasons; To deal with social and consumerism pressures and their effects, people may on occasion consume even more to feel better; Rising consumer debt puts pressure on families.\n\nExcerpt 2: Consumption as a path to cultivation\nConsumption, for George Simmel, German sociologist and philosopher, lies at the heart of the process through which people become cultivated, that is, grow to become participating, reflective members of society. This is because consumption provides an excellent site for the interaction between subject and object, which Simmel believed to be the key to cultivation. Subjectivity, the uniquely human capacity for self-reflection, which allows for the self-conscious construction of action and identity, is not naturally endowed; it only develops through the creative tension provided by interaction with objects (including people) existing in the world. For Simmel, consumption provides a vital forum for this subject-object interaction. Through consumption, people come to understand, instill meaning in, and act upon objects encountered in the world. Consumption provides people with the opportunity to refine themselves through interacting with objects in the world. In addition, by confronting, adapting, and integrating various world-views directly or indirectly demonstrated in consumption objects, people not only realize their potential as unique human beings, they also become well-socialized members of a society.' },
  { level:'TEM-8', type:'writing', examDate:'2018-03', title:'Aiming for Perfection: Helpful or Harmful?',
    prompt:'Read carefully the following two excerpts on perfection, and then write an article of NO LESS THAN 300 WORDS, in which you should:\n1. summarize the main arguments in the two excerpts, and then\n2. express your opinion on perfection, especially on whether aiming for perfection matters in whatever you do.\n\nExcerpt 1: Headmistress tells pupils not to fret about exams\nPupils should not worry about their exam results because no one will remember them in years to come, the head of a leading girls\' school has said. Judith Carlisle, headmistress of Oxford High School, said there was no point fretting over GCSEs because no one will "give a damn" about results — and because they don\'t reflect character. She is running a "Death of Little Miss Perfect" initiative at the private school to combat perfectionism in her students. "Perfectionism is only captured in a moment — it\'s not achievable longer term," she said. "It undermines self-esteem and then performance." Miss Carlisle said that students don\'t always need to aim for 100 per cent, and if they do need an A grade to attend their university of choice, it\'s not necessary to get the highest A possible. She said: "It matters, but sometimes it probably won\'t matter. It\'s important (the girls are) not going for things that if they don\'t get it, it will destroy them. Exams aren\'t who they are — it\'s what they did on that day."\n\nExcerpt 2: The Pursuit of Perfection\nThe pursuit of perfection is a strategy for motivating organizations to innovate and reach levels of improvement and performance not previously seen as possible. Leveraging the pursuit of perfection as a strategy was developed and refined by quality leaders such as Bob Galvin and Paul O\'Neill, and it has led to success in industries including health care, telecommunication, and manufacturing. Prior to serving as U.S. Secretary of the Treasury, Paul O\'Neill was one of the most successful industrial leaders of the 20th century. As CEO of Alcoa from 1987 to 1999, he proposed and demanded a radical goal: zero work-loss incidents. No one would be hurt working at Alcoa. Alcoa moved toward perfection, becoming the safest industrial company in the world — as well as the most successful aluminum producer in the world. Paul O\'Neill has developed a revolutionary kind of leadership — one that centers around the pursuit of perfection.' },
  { level:'TEM-8', type:'writing', examDate:'2017-03', title:'Job Hopping: Beneficial or Harmful to Career?',
    prompt:'Read carefully the following two excerpts on job hopping, and then write an article of NO LESS THAN 300 WORDS, in which you should:\n1. summarize the main arguments in the two excerpts, and then\n2. express your opinion towards job hopping, especially on whether job hopping would benefit your career development.\n\nExcerpt 1: The Pros of Job Hopping\nUntil recently, job hopping was considered career suicide. But things have changed. As job longevity becomes a thing of the past, employers and recruiters are beginning to have a different outlook on job hopping. According to the Bureau of Labor Statistics, the average number of years that U.S. workers have been with their current employer is 4.6. Tenure of young employees (ages 20 to 34) is only half that (2.3 years). As it turns out, job hopping can be extremely advantageous for certain types of people — if they do it for the right reasons, says Laurie Lopez, a partner and senior general manager in the IT Contracts division at Wintertime. "For those in technology, for example, it allows them the opportunity to gain valuable technical knowledge in different environments and cultures. This can be more common for those specializing in IT. In order to keep their skills fresh, it is necessary for technologists to remain current in a highly competitive market."\n\nExcerpt 2: Job hopping becomes more difficult as employers seek solid credentials\nAmid a slowdown in the country\'s economic growth, the good times for job hoppers might be coming to an end, said Angel Lam, associate director of commerce and finance, human resources, supply chain and operation business of Robert Walters. Job hoppers are those who frequently change jobs in a two-year span, according to global recruitment consultancy Robert Walters. Employers started to shun the job hoppers in 2012, and the trend became more apparent in 2013 and this year. "About 90 percent of our clients will simply reject the candidate if they find traces indicating job hopping in the resumes. They wouldn\'t even give an interview," she said. The usual time span for candidates to change a job should be between four to six years, especially for middle to senior management candidates, as they have to demonstrate progress to their employers over this period of time, according to Lam.' },
  { level:'TEM-8', type:'writing', examDate:'2016-03', title:'The Ice Bucket Challenge: Success or Slacktivism?',
    prompt:'Read carefully the following two excerpts about Ice Bucket Challenge, an activity initiated to raise money and awareness for the disease ALS. From the excerpts you can find that the activity seems to have achieved much success, but there have also been doubt and criticism. Write an article of NO LESS THAN 300 words, in which you should:\n1. Summarize the development of the ice bucket challenge activity, and then\n2. Express your opinion towards the activity, especially whether the problems found with this kind of activity will finally undermine its original purpose.\n\nExcerpt 1: ALS Ice Bucket Challenge Takes U.S. by Storm\nIn the last two weeks, the Ice Bucket Challenge has quite literally "soaked" the nation. Everyone from Ethel Kennedy to Justin Timberlake has poured a bucket of ice water over his or her head and challenged others to do the same or make a donation to fight ALS within twenty-four hours. Between July 29th and today, August 12, the ALS Association and its 38 chapters have received an astonishing $4 million in donations compared with $1.12 million during the same time period last year. The ALS Association is incredibly grateful for the outpouring of support from those people who have been doused, made a donation, or both. "We have never seen anything like this in the history of the disease," said Barbara Newhouse, President and CEO of the ALS Association. With only about half of the general public knowledge about amyotrophic lateral sclerosis (ALS), the Ice Bucket Challenge is making a profound difference. Since July 29, the Association has welcomed more than 70,000 new donors to the cause.\n\nExcerpt 2: Ice Bucket challenge: who\'s pouring cold water on the idea?\nThe ice bucket challenge has certainly raised awareness. Whether that\'s primarily of the disease for which it is raising funds or the speed at which images of swimsuit-clad celebrities will go viral is a long-term question. More pertinent right now is whether or not the craze has reached a tipping point. As it lived by social media, so the ice bucket challenge could die by it. The state of California is currently experiencing one of the worst droughts on record. So gestures such as companies dousing their staff en masse in hundreds of gallons of icy water, come across more as wasteful PR exercises than charitable gestures — and are being called out as such on Twitter. There has been a similar reaction in China. Last week, people in drought-stricken Henan province raised empty red buckets over their heads, accompanied by the slogan "Henan, please say no to the ice bucket challenge". China\'s ministry for civil affairs, while broadly supportive, has warned citizens against the practice\'s "entertainment and commercial tendencies".' },

  // ================================================================
  // TEM-8 Translation (Chinese → English, Real Exam Materials)
  // ================================================================
  { level:'TEM-8', type:'translation', examDate:'2024-04', title:'Chinese Science Fiction Goes Global',
    prompt:'中国科幻小说在国际上越来越受欢迎，已成为一种新的国际交流方式。可以预见，中国科幻将创作出更多跨越国界、具有世界影响力的优秀作品。中国科幻要走向未来，必不可少的是文化使命感。如何将中国人对科技、宇宙、未来的想象，深刻地展现给世界，同时融入中华优秀传统文化，呈现对构建人类命运共同体的深入思考，这是摆在中国科幻作家面前的课题。' },
  { level:'TEM-8', type:'translation', examDate:'2023-04', title:'Chinese Traditional Culture',
    prompt:'中国传统文化是我们先辈传承下来的丰厚遗产。她无时无刻不在影响着今天的中国人，为我们开创新文化提供历史根据和现实基础。传统文化在影响现实的同时，也必然在新时代的氛围中发生蜕变。中国传统文化犹如一条奔腾了五千年的永不干涸的大河，她亦旧亦新，不断吐故纳新，持续创新。' },
  { level:'TEM-8', type:'translation', examDate:'2022-04', title:'Wilderness and Cities',
    prompt:'旷野和城市，从根本上讲，是对立的。城市驱散了旷野原有的住民，破坏了旷野古老的风景，越来越多地以井然有序的繁华，取代我行我素的自然风光。今天，旷野日益退缩着。但人们不应忽略旷野，漠视旷野，而要寻觅出与其相亲相守的最佳间隙。善待旷野就是善待人类自身。要知道，人类永远不可能以城市战胜旷野。' },
  { level:'TEM-8', type:'translation', examDate:'2021-04', title:'Youth is a Journey into the Distance',
    prompt:'你的青春就是一场远行，一场离自己的童年，离自己的少年，越来越远的远行。你会发现这个世界跟你想象的一点都不一样，你甚至会觉得很孤独，你会受到很多的排挤。度假和旅行，其实都解决不了这些问题，我解决问题的办法，就是不停寻找自己所热爱的一切。' },
  { level:'TEM-8', type:'translation', examDate:'2019-03', title:'Baiyangdian — The Northern Jiangnan',
    prompt:'白洋淀曾有"北国江南"的说法，但村舍的形制自具特色，与江南截然不同。南方多雨，屋顶是坡顶；这里的村舍则不同，屋顶是晒粮食的地方，而且历史上每逢水大洪泛，村民就得把屋里的东西搬到屋顶上。房屋彼此挨得很近，有些屋顶几乎相连。' },
  { level:'TEM-8', type:'translation', examDate:'2018-03', title:'Literature Cultivates Sensitivity',
    prompt:'文学书籍起码使我们的内心可以达到这样的三感：善感、敏感和美感。生活不如意时，文学书籍给我们提供了可以达到一种比现实更美好的境界——书里面的水可能比我们现实生活中的水要清，天比我们现实中的天要蓝；现实中没有完美的爱情，但在书里有永恒的《梁山伯与祝英台》《罗密欧与朱丽叶》。读书，会弥补我们现实生活中所存在的不堪和粗糙。' },
  { level:'TEM-8', type:'translation', examDate:'2017-03', title:'The Chinese New Year — A Child\'s Joy, An Adult\'s Sigh',
    prompt:'我小的时候特别盼望过年，往往是一过了腊月，就开始掰着指头数日子。对于我们这种焦急的心态，大人们总是发出深沉的感叹，好像他们不但不喜欢过年，而且还惧怕过年。他们的态度令当时的我感到失望和困惑，现在我完全能够理解了。我想长辈们之所以对过年感慨良多，一是因为过年意味着一笔开支，二是飞速流逝的时间对他们构成巨大压力。小孩子可以兴奋地说：过了年，我又长大了一岁；而老人们则叹息：嗨，又老了一岁。过年意味着小孩子正在向自己生命过程中的辉煌时期进步，而对于大人，则意味着正向衰朽的残年滑落。' },
  { level:'TEM-8', type:'translation', examDate:'2016-03', title:'Time Flows Like a River',
    prompt:'流逝，表现了南国人对时间最早的感觉。"子在川上曰:逝者如斯夫。"他们发现无论是潺潺小溪，还是浩荡大河，都一去不复返，流逝之际青年变成了老翁而绿草转眼就枯黄，很自有惜阴的紧迫感。流逝也许是缓慢的，但无论如何缓慢，对流逝的恐惧使人们必须用"流逝"这个词来时时警戒后人，必须急匆匆地行动，给这个词灌注一种紧张感。' },
  { level:'TEM-8', type:'translation', examDate:'2015-03', title:'The Camellia Show',
    prompt:'茶花(camellia)的自然花期在12月至翌年4月，以红色系为主，另有黄色系和白色系等，花色艳丽。本届花展充分展示了茶花的品种资源和科研水平，是近三年来本市规模最大的一届茶花展。为了使广大植物爱好者有更多与茶花亲密接触的机会，本届茶花展的布展范围延伸至整个园区，为赏花游客带来便利。此次茶花展历时2个月，展期内200多个茶花品种将陆续亮相。' },
];

// ---- DeepSeek generation functions ----

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeHighlights(h: any): string | null {
  if (!h) return null;
  let text: string;
  if (typeof h === 'string') text = h;
  else if (Array.isArray(h)) text = h.join('\n');
  else text = String(h);
  // Reject placeholder / template content
  if (text.includes('好词好句亮点解析') && !text.includes(': ')) return null;
  if (text === '3-5个好词好句亮点解析，格式：') return null;
  return text;
}

// Force paragraph breaks: split by sentences, group 2-3 sentences per paragraph
function forceParagraphs(text: string): string {
  // Already has paragraph breaks, leave it
  if (text.includes('\n\n')) return text;
  // Split on sentence boundaries
  const sentences = text.match(/[^.!?\n]+[.!?]+[\s\n]*/g) || [text];
  if (sentences.length <= 3) return text;
  const groups: string[] = [];
  const perGroup = Math.max(2, Math.ceil(sentences.length / 3));
  for (let i = 0; i < sentences.length; i += perGroup) {
    groups.push(sentences.slice(i, i + perGroup).join(' ').trim());
  }
  return groups.join('\n\n');
}

async function generateWriting(topic: Topic): Promise<any> {
  const prompt = `你是一位资深的英语写作教师。请为以下英语考试作文题生成2篇不同角度/风格的范文。

考试级别：${topic.level}
考试时间：${topic.examDate}
作文题目：${topic.title}
真题要求：${topic.prompt}

请生成2篇范文，每篇范文应：
- 严格遵守题目要求的字数范围（CET-4: 120-180词, CET-6: 150-200词, TEM-8: 300+词）
- 符合${topic.level}的难度水平
- 两篇范文从不同角度/立场切入
- **段落之间必须用空行分隔**，每段用 \\n\\n 隔开，像这样："段落一内容。\\n\\n段落二内容。\\n\\n段落三内容。" 不允许整篇挤成一段。

请严格按以下JSON格式输出，不要输出其他内容：
{
  "essays": [
    { "essay": "范文1英文全文", "translation": "范文1中文翻译" },
    { "essay": "范文2英文全文", "translation": "范文2中文翻译" }
  ],
  "highlights": "列出3-5个范文中的好词好句和高级表达，每行一条，格式为\\n- 英文表达: 中文解释\\n- 英文表达: 中文解释\\n(注意：必须给出具体内容，不要写格式说明)"
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });
    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) return null;
    const json = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(json);
  } catch (err) {
    console.error(`[Seed] Failed: ${topic.title}`, err);
    return null;
  }
}

async function generateTranslation(topic: Topic): Promise<any> {
  const prompt = `你是一位资深的英语翻译教师。请为以下翻译真题生成一份高质量参考译文。

考试级别：${topic.level}
考试时间：${topic.examDate}
翻译话题：${topic.title}
中文原文：${topic.prompt}

请严格按以下JSON格式输出，不要输出其他内容：
{
  "content": "英文参考译文（整段流畅翻译，不要逐句分割）",
  "highlights": "列出3-5个翻译中的关键词汇和难点表达，每行一条，格式为\\n- 英文表达: 翻译要点解析\\n- 英文表达: 翻译要点解析\\n(注意：必须给出具体内容，不要写格式说明)"
}`;

  try {
    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });
    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) return null;
    const json = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(json);
  } catch (err) {
    console.error(`[Seed] Failed: ${topic.title}`, err);
    return null;
  }
}

// ---- Main ----

async function main() {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error('DEEPSEEK_API_KEY not set. Please set it in server/.env');
    process.exit(1);
  }

  const total = topics.length;
  let completed = 0;
  let failed = 0;
  let skipped = 0;

  console.log(`Starting seed: ${topics.length} topics total.\n`);

  for (const topic of topics) {
    const label = `[${completed + failed + skipped + 1}/${total}] ${topic.level} ${topic.type === 'writing' ? '写作' : '翻译'}: ${topic.title} (${topic.examDate})`;

    // Skip if already exists
    const exists = await prisma.essay.findFirst({
      where: { level: topic.level, type: topic.type, title: topic.title, examDate: topic.examDate },
    });
    if (exists) {
      console.log(`${label} → Skipped`);
      skipped++;
      continue;
    }

    console.log(`${label} ...`);

    let result;
    if (topic.type === 'writing') {
      result = await generateWriting(topic);
      if (result?.essays?.length >= 2) {
        // Force paragraph breaks on each essay
        result.essays = result.essays.map((e: any) => ({ ...e, essay: forceParagraphs(e.essay) }));
        await prisma.essay.create({
          data: {
            level: topic.level,
            type: topic.type,
            title: topic.title,
            prompt: topic.prompt,
            content: JSON.stringify(result.essays),
            highlights: normalizeHighlights(result.highlights),
            examDate: topic.examDate,
          },
        });
        console.log(`  ✓ ${result.essays.length} essays`);
        completed++;
      } else {
        failed++;
        console.log(`  ✗ Failed`);
      }
    } else {
      result = await generateTranslation(topic);
      if (result?.content) {
        await prisma.essay.create({
          data: {
            level: topic.level,
            type: topic.type,
            title: topic.title,
            prompt: topic.prompt,
            content: result.content,
            highlights: normalizeHighlights(result.highlights),
            examDate: topic.examDate,
          },
        });
        console.log(`  ✓ Translation`);
        completed++;
      } else {
        failed++;
        console.log(`  ✗ Failed`);
      }
    }

    if (completed + failed + skipped < total) await delay(2000);
  }

  console.log(`\nDone! ${completed} new, ${skipped} skipped, ${failed} failed.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
