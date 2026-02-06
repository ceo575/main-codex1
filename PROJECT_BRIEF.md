# PROJECT BRIEF: WebFlowMap (FlowMapV2) - Luyện thi & Tư duy số

## 1. Mục tiêu sản phẩm
Xây dựng nền tảng học tập thông minh kết hợp giữa **luyện thi trắc nghiệm (Exam)** và **bản đồ tư duy (FlowMap)**. 
Hệ thống giúp học sinh không chỉ làm bài tập mà còn hiểu sâu luồng tư duy giải quyết vấn đề nhờ sự hỗ trợ của AI phân tích điểm mạnh/yếu, từ đó cá nhân hóa lộ trình ôn luyện.
Sản phẩm hướng tới trải nghiệm "Premium" với giao diện hiện đại, render công thức toán đẹp và tốc độ phản hồi nhanh.

## 2. Personas (Chân dung người dùng)
**👩‍🎓 Student (Học viên)**
- Muốn luyện đề thi thử có cấu trúc giống thật (thời gian, phân loại câu hỏi).
- Cần xem lời giải chi tiết và nhận xét vì sao sai (Analysis).
- Quan tâm đến lịch sử làm bài để theo dõi sự tiến bộ.
- Cần giao diện dễ nhìn, tập trung, hiển thị công thức Toán rõ ràng.

**👨‍🏫 Admin/Teacher (Giáo viên)**
- Cần công cụ soạn thảo đề thi nhanh (hỗ trợ nhập từ Word/LaTeX).
- Muốn quản lý ngân hàng câu hỏi theo chuyên đề/chương.
- Theo dõi thống kê chung của học sinh (đã làm bao nhiêu đề, điểm trung bình).

## 3. Modules & Navigation (Information Architecture)
Dựa trên cấu trúc `src/app` và `Sidebar`:
- **Dashboard (`/dashboard`)**: Tổng quan hoạt động, bài thi mới, biểu đồ tiến độ.
- **My Exams (`/my-exams`)**: Lịch sử bài thi đã làm, trạng thái (đang làm/đã xong).
- **Practice (`/practice`)**: Kho bài tập tự luyện (theo chủ đề/dạng bài).
- **Exam Interface (`/exam/[id]/take`)**: Màn hình làm bài focus mode (cột câu hỏi + cột phiếu trả lời).
- **Exam Result (`/exam/[id]/result`)**: Báo cáo kết quả, Score Ring, AI Insight, phân tích theo chương.
- **Profile (`/profile`)**: Quản lý tài khoản.
- **Auth**: Login (Credentials/Google), Register.
- **Admin Portal (`/admin`)**: Quản lý đề thi, câu hỏi, users.

## 4. Core Business Rules (Quy tắc nghiệp vụ)
- **Scoring**: Điểm tính theo thang 10 hoặc 100 tùy cấu hình bài thi. Mỗi câu đúng được cộng điểm, sai không trừ.
- **Timer**: Bài thi có thời gian đếm ngược. Hết giờ tự động nộp (auto-submit).
- **Access Control**: Chỉ Student đã đăng nhập mới được làm bài. Chỉ Admin được tạo/sửa bài thi.
- **AI Analysis Input/Output**: 
  - *Input*: Danh sách câu trả lời của học sinh + Đáp án đúng + Dữ liệu câu hỏi.
  - *Output*: Text nhận xét tổng quan (AI Insight), gợi ý lộ trình khắc phục (Recovery Path).
- **Review Mode**: Sau khi nộp, học sinh được xem lại toàn bộ bài làm kèm lời giải chi tiết (Explanation).

## 5. Out of Scope (Không làm giai đoạn này)
- **Thanh toán online (Payment)**: Chưa tích hợp cổng thanh toán, mọi bài thi hiện tại là miễn phí hoặc cấp quyền thủ công.
- **Mobile Native App**: Chỉ tập trung Web Responsive (Next.js).
- **Real-time Collaboration**: Không có tính năng nhiều người cùng làm 1 đề hay vẽ chung map.
- **Chat/Forum**: Không tích hợp hệ thống thảo luận xã hội.
- **Offline Mode**: Ứng dụng yêu cầu kết nối mạng để tải đề và lưu kết quả.

## 6. Roadmap (5 nhiệm vụ tiếp theo)
1. **Hoàn thiện Auth**: Kích hoạt lại Google Login và xử lý Session ổn định hơn.
2. **AI Integration**: Implement module gọi Gemini API thực sự để sinh "AI Insight" thay vì mock data.
3. **Word Import**: Hoàn thiện `word-parser` để Admin upload đề docx và tự tách câu hỏi/ảnh.
4. **User Analytics**: Vẽ biểu đồ chi tiết hơn về sự tiến bộ (Line chart điểm số qua các bài thi).
5. **Admin Dashboard Upgrade**: Thêm thống kê tổng quan hệ thống (active users, total exams).
