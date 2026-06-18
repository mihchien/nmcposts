import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
3
async function main() {
  console.log("🌱 Seeding database...");

  // Admin
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@nmc.blog" },
    update: {},
    create: {
      email: "admin@nmc.blog",
      password: hashedPassword,
      name: "Nguyễn Minh Chiến",
    },
  });
  console.log("✅ Admin created: admin@nmc.blog / admin123");

  // Categories
  const categories = [
    { name: "AI", slug: "ai", color: "#8B5CF6" },
    { name: "Lập Trình", slug: "programming", color: "#3B82F6" },
    { name: "Robotics", slug: "robotics", color: "#F97316" },
    { name: "Arduino", slug: "arduino", color: "#14B8A6" },
    { name: "Giáo Dục", slug: "education", color: "#10B981" },
    { name: "Teaching Tips", slug: "teaching-tips", color: "#F59E0B" },
    { name: "STEAM", slug: "steam", color: "#EC4899" },
  ];

  const createdCategories: Record<string, number> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = c.id;
  }
  console.log("✅ Categories created");

  // Sample posts
  const posts = [
    {
      title: "AI trong Giáo Dục: Cơ Hội và Thách Thức",
      slug: "ai-trong-giao-duc-co-hoi-va-thach-thuc",
      excerpt: "Trí tuệ nhân tạo đang thay đổi cách chúng ta dạy và học. Hãy cùng khám phá những cơ hội tuyệt vời và những thách thức cần vượt qua.",
      content: `# AI trong Giáo Dục: Cơ Hội và Thách Thức

Trí tuệ nhân tạo (AI) đang tạo ra một cuộc cách mạng trong giáo dục. Từ việc cá nhân hóa trải nghiệm học tập đến tự động hóa các nhiệm vụ hành chính, AI đang mở ra những khả năng chưa từng có.

## Cơ Hội

### 1. Học tập cá nhân hóa
AI có thể phân tích cách học của từng học sinh và điều chỉnh nội dung phù hợp. Thay vì một giáo án chung cho tất cả, mỗi em có thể có lộ trình học riêng.

### 2. Hỗ trợ giáo viên
Các công cụ AI giúp giáo viên tiết kiệm thời gian chấm bài, soạn bài, và có thêm thời gian tương tác với học sinh.

### 3. Tiếp cận giáo dục toàn cầu
AI giúp dịch và địa phương hóa nội dung học tập, mở ra cơ hội học tập cho học sinh ở mọi vùng miền.

## Thách Thức

### 1. Khoảng cách số
Không phải tất cả học sinh đều có thiết bị và internet để tiếp cận công nghệ AI.

### 2. Quyền riêng tư dữ liệu
Thu thập dữ liệu học sinh để cá nhân hóa học tập đặt ra nhiều câu hỏi về quyền riêng tư.

### 3. Đào tạo giáo viên
Giáo viên cần được đào tạo để sử dụng hiệu quả các công cụ AI trong lớp học.

## Kết Luận

AI không phải là sự thay thế cho giáo viên, mà là công cụ mạnh mẽ giúp nâng cao chất lượng giáo dục. Chìa khóa là cách chúng ta tích hợp AI một cách thông minh và có trách nhiệm.`,
      categorySlug: "ai",
      featured: true,
      published: true,
    },
    {
      title: "Hướng Dẫn Học Python cho Người Mới Bắt Đầu",
      slug: "huong-dan-hoc-python-cho-nguoi-moi",
      excerpt: "Python là ngôn ngữ lập trình tuyệt vời để bắt đầu hành trình coding. Bài viết này sẽ giúp bạn hiểu những khái niệm cơ bản nhất.",
      content: `# Hướng Dẫn Học Python cho Người Mới Bắt Đầu

Python là một trong những ngôn ngữ lập trình phổ biến nhất thế giới. Với cú pháp đơn giản và cộng đồng lớn mạnh, Python là lựa chọn hoàn hảo cho người mới bắt đầu.

## Tại Sao Chọn Python?

- **Cú pháp đơn giản**: Gần giống với tiếng Anh tự nhiên
- **Đa năng**: Web, AI, Data Science, Automation...
- **Cộng đồng lớn**: Hàng triệu lập trình viên và tài liệu phong phú

## Cài Đặt Python

\`\`\`bash
# Tải Python tại python.org
# Kiểm tra cài đặt
python --version
\`\`\`

## Chương Trình Đầu Tiên

\`\`\`python
print("Xin chào, thế giới!")
name = input("Tên bạn là gì? ")
print(f"Chào {name}!")
\`\`\`

## Các Kiểu Dữ Liệu Cơ Bản

\`\`\`python
# Số nguyên
tuoi = 25

# Số thực
diem = 9.5

# Chuỗi
ten = "Nguyễn Văn A"

# Boolean
da_hoc = True
\`\`\`

## Tiếp Theo

Sau khi nắm vững cơ bản, bạn có thể học về:
- Hàm và module
- Lập trình hướng đối tượng
- Thư viện như NumPy, Pandas cho Data Science`,
      categorySlug: "programming",
      featured: true,
      published: true,
    },
    {
      title: "Xây Dựng Robot Đầu Tiên với Arduino",
      slug: "xay-dung-robot-dau-tien-voi-arduino",
      excerpt: "Bước vào thế giới robotics với Arduino! Chúng ta sẽ cùng nhau xây dựng một robot đơn giản có thể di chuyển và tránh vật cản.",
      content: `# Xây Dựng Robot Đầu Tiên với Arduino

Robotics là một lĩnh vực thú vị kết hợp điện tử, lập trình và cơ khí. Với Arduino, bạn có thể bắt đầu hành trình robotics ngay hôm nay!

## Vật Liệu Cần Chuẩn Bị

- Arduino Uno
- Module điều khiển động cơ L298N
- 2 động cơ DC
- Cảm biến siêu âm HC-SR04
- Pin và dây điện

## Nguyên Lý Hoạt Động

Robot sẽ sử dụng cảm biến siêu âm để phát hiện vật cản. Khi phát hiện vật cản trong phạm vi 20cm, robot sẽ dừng lại và rẽ hướng.

## Code Arduino

\`\`\`cpp
#define TRIG 9
#define ECHO 10

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  Serial.begin(9600);
}

long measureDistance() {
  digitalWrite(TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG, LOW);

  long duration = pulseIn(ECHO, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  long distance = measureDistance();

  if (distance < 20) {
    // Dừng lại và rẽ
    stopMotors();
    delay(500);
    turnRight();
    delay(800);
  } else {
    moveForward();
  }
}
\`\`\`

## Lắp Ráp

1. Kết nối động cơ với module L298N
2. Kết nối L298N với Arduino
3. Gắn cảm biến siêu âm
4. Nạp code và thử nghiệm`,
      categorySlug: "robotics",
      featured: false,
      published: true,
    },
    {
      title: "7 Phương Pháp Dạy Học Hiệu Quả Trong Thời Đại Số",
      slug: "7-phuong-phap-day-hoc-hieu-qua",
      excerpt: "Giáo dục hiện đại đòi hỏi những phương pháp mới. Hãy khám phá 7 phương pháp dạy học hiệu quả nhất mà mọi giáo viên nên biết.",
      content: `# 7 Phương Pháp Dạy Học Hiệu Quả Trong Thời Đại Số

Giáo dục hiện đại không chỉ là truyền đạt kiến thức một chiều. Học sinh cần được tham gia tích cực vào quá trình học tập.

## 1. Học Qua Làm (Project-Based Learning)

Học sinh học tốt nhất khi họ tự tay tạo ra sản phẩm. Thay vì nghe giảng về điện trở, hãy cho học sinh xây dựng một mạch điện thực tế.

## 2. Gamification

Biến bài học thành trò chơi với điểm số, huy hiệu và bảng xếp hạng. Kahoot, Quizlet là những công cụ tuyệt vời cho việc này.

## 3. Flipped Classroom

Học sinh xem video bài giảng ở nhà, đến lớp làm bài tập. Giáo viên có thêm thời gian hỗ trợ cá nhân.

## 4. Collaborative Learning

Học nhóm không chỉ là chia công việc. Thiết kế các bài tập đòi hỏi học sinh phải cộng tác thực sự.

## 5. Socratic Seminar

Thay vì cho câu trả lời, đặt câu hỏi để học sinh tự khám phá. "Em nghĩ tại sao điều này xảy ra?"

## 6. Design Thinking

Dạy học sinh giải quyết vấn đề theo quy trình: Empathize → Define → Ideate → Prototype → Test.

## 7. Feedback ngay lập tức

Học sinh cần biết họ làm đúng hay sai ngay lập tức. Các công cụ như Google Forms, Padlet giúp thu thập và phản hồi nhanh.`,
      categorySlug: "teaching-tips",
      featured: true,
      published: true,
    },
    {
      title: "STEAM Education: Giáo Dục Tích Hợp Cho Tương Lai",
      slug: "steam-education-giao-duc-tich-hop",
      excerpt: "STEAM không chỉ là viết tắt của các môn học. Đây là triết lý giáo dục giúp học sinh phát triển toàn diện và sẵn sàng cho tương lai.",
      content: `# STEAM Education: Giáo Dục Tích Hợp Cho Tương Lai

STEAM (Science, Technology, Engineering, Art, Mathematics) là mô hình giáo dục hiện đại tích hợp nhiều lĩnh vực.

## STEAM là gì?

- **S**cience - Khoa học
- **T**echnology - Công nghệ
- **E**ngineering - Kỹ thuật
- **A**rt - Nghệ thuật
- **M**athematics - Toán học

## Tại Sao STEAM Quan Trọng?

Thế giới việc làm tương lai đòi hỏi kỹ năng đa dạng. Học sinh không chỉ cần kiến thức chuyên môn mà còn cần tư duy sáng tạo, kỹ năng giải quyết vấn đề.

## Ví Dụ Bài Học STEAM

### Dự án: Nhà Kính Thông Minh

**Khoa học**: Nghiên cứu về quang hợp và điều kiện phát triển của cây
**Công nghệ**: Sử dụng cảm biến Arduino để đo nhiệt độ, độ ẩm
**Kỹ thuật**: Thiết kế hệ thống tưới nước tự động
**Nghệ thuật**: Thiết kế giao diện dashboard đẹp mắt
**Toán học**: Phân tích dữ liệu và tính toán lượng nước cần tưới

## Làm Thế Nào Để Tích Hợp STEAM

1. Bắt đầu với một vấn đề thực tế
2. Yêu cầu học sinh nghiên cứu và lên kế hoạch
3. Học sinh tự thiết kế và thực hiện giải pháp
4. Trình bày kết quả và nhận phản hồi`,
      categorySlug: "steam",
      featured: false,
      published: true,
    },
    {
      title: "Giới Thiệu Arduino: Bắt Đầu Từ Đâu?",
      slug: "gioi-thieu-arduino-bat-dau-tu-dau",
      excerpt: "Arduino là nền tảng mã nguồn mở tuyệt vời cho người mới bắt đầu với điện tử và lập trình nhúng. Cùng tìm hiểu cách bắt đầu!",
      content: `# Giới Thiệu Arduino: Bắt Đầu Từ Đâu?

Arduino là nền tảng phần cứng và phần mềm mã nguồn mở giúp bạn tạo ra các dự án điện tử tương tác.

## Arduino là gì?

Arduino là một bo mạch vi điều khiển có thể lập trình được. Nó có thể đọc tín hiệu từ cảm biến và điều khiển các thiết bị khác.

## Tại Sao Chọn Arduino?

- **Dễ học**: Ngôn ngữ C++ được đơn giản hóa
- **Cộng đồng lớn**: Hàng nghìn dự án chia sẻ miễn phí
- **Giá rẻ**: Bo mạch clone chỉ 50-100k
- **Linh hoạt**: Hàng nghìn module mở rộng

## Dự Án LED Nhấp Nháy

\`\`\`cpp
// Chương trình Arduino đầu tiên: LED nhấp nháy

void setup() {
  // Cấu hình chân 13 là đầu ra
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);  // Bật LED
  delay(1000);              // Chờ 1 giây
  digitalWrite(13, LOW);   // Tắt LED
  delay(1000);              // Chờ 1 giây
}
\`\`\`

## Các Module Phổ Biến

- **Cảm biến nhiệt độ DHT11/DHT22**: Đo nhiệt độ và độ ẩm
- **Cảm biến siêu âm HC-SR04**: Đo khoảng cách
- **Module Bluetooth HC-05**: Giao tiếp không dây
- **Module WiFi ESP8266**: Kết nối Internet`,
      categorySlug: "arduino",
      featured: false,
      published: true,
    },
  ];

  for (const postData of posts) {
    const { categorySlug, ...data } = postData;
    const categoryId = createdCategories[categorySlug];
    await prisma.post.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, categoryId },
    });
  }
  console.log("✅ Sample posts created");

  // Sample projects
  await prisma.project.upsert({
    where: { slug: "he-thong-quan-ly-lop-hoc-ai" },
    update: {},
    create: {
      title: "Hệ Thống Quản Lý Lớp Học AI",
      slug: "he-thong-quan-ly-lop-hoc-ai",
      description: "Ứng dụng web giúp giáo viên quản lý lớp học, theo dõi tiến độ học sinh và tự động tạo báo cáo bằng AI.",
      content: "Dự án sử dụng Python, FastAPI và OpenAI API để xây dựng hệ thống quản lý lớp học thông minh.",
      category: "Giáo dục",
      tags: JSON.stringify(["Python", "AI", "FastAPI", "OpenAI"]),
      featured: true,
      published: true,
    },
  });

  await prisma.project.upsert({
    where: { slug: "robot-tranh-vat-can-arduino" },
    update: {},
    create: {
      title: "Robot Tránh Vật Cản Arduino",
      slug: "robot-tranh-vat-can-arduino",
      description: "Robot tự động sử dụng cảm biến siêu âm để phát hiện và tránh vật cản. Dự án phù hợp cho học sinh THCS.",
      category: "Arduino",
      tags: JSON.stringify(["Arduino", "Robotics", "C++", "IoT"]),
      featured: true,
      published: true,
    },
  });

  console.log("✅ Sample projects created");

  // Sample resources
  const resourceData = [
    {
      title: "Python Cơ Bản - Giáo Án 10 Buổi",
      description: "Giáo án đầy đủ 10 buổi dạy Python cho học sinh THPT, bao gồm slide, bài tập và đáp án.",
      category: "Lập Trình",
      type: "lesson",
      published: true,
    },
    {
      title: "ChatGPT cho Giáo Viên",
      description: "Hướng dẫn sử dụng ChatGPT để soạn bài, tạo bài tập và đánh giá học sinh hiệu quả.",
      url: "https://openai.com/chatgpt",
      category: "AI",
      type: "tool",
      published: true,
    },
    {
      title: "Tài Liệu Arduino Tiếng Việt",
      description: "Hướng dẫn Arduino từ cơ bản đến nâng cao bằng tiếng Việt, có ví dụ thực tế.",
      category: "Arduino",
      type: "pdf",
      published: true,
    },
    {
      title: "Scratch - Lập Trình Cho Trẻ Em",
      description: "Nền tảng lập trình kéo thả của MIT, phù hợp cho học sinh tiểu học và THCS.",
      url: "https://scratch.mit.edu",
      category: "Lập Trình",
      type: "tool",
      published: true,
    },
  ];

  const existingResourceCount = await prisma.resource.count();
  if (existingResourceCount === 0) {
    for (const res of resourceData) {
      await prisma.resource.create({ data: res });
    }
  }
  console.log("✅ Sample resources created");

  console.log("\n🎉 Seeding completed!");
  console.log("📧 Admin email: admin@nmc.blog");
  console.log("🔑 Admin password: admin123");
  console.log("🌐 Run: npm run dev");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
