# Project Context for AI Agents (WebFlowMap)

## 1. Project Overview & Product Context
**WebFlowMap (FlowMapV2)** là nền tảng Luyện thi và Bản đồ tư duy trực tuyến, tập trung vào trải nghiệm học tập được cá nhân hóa qua AI. Hệ thống cho phép học sinh làm bài thi trực tuyến với công thức toán học phức tạp, nhận phân tích kết quả chi tiết từ AI, và theo dõi tiến độ học tập.

### User Roles
- **Học viên (Student)**: Làm bài thi, xem kết quả phân tích, xem lại lịch sử bài làm, quản lý thông tin cá nhân.
- **Quản trị viên (Admin)**: Quản lý ngân hàng câu hỏi, bài thi, người dùng (suy ra từ cấu trúc folder).

### Information Architecture (IA)
Hệ thống được chia thành các khu vực chính:
- **Authentication**: `/(auth)/login`, `/(auth)/register`.
- **Student Portal**:
  - **Dashboard**: Tổng quan tiến độ.
  - **Practice**: Khu vực luyện tập theo chủ đề.
  - **Exam**: Làm bài thi (`/exam/[id]/take`), xem kết quả (`/exam/[id]/result`), xem lại bài (`/exam/[id]/review`).
  - **My Exams**: Lịch sử bài thi.
  - **Profile**: Cài đặt tài khoản.
- **Admin Portal**: `/(admin)/admin` - Quản lý hệ thống.

### Critical User Flows
1. **Làm bài thi**: Login -> Dashboard/Practice -> Chọn bài thi -> Làm bài (Exam Interface) -> Nộp bài -> Xem điểm & Phân tích AI.
2. **Review kết quả**: Vào My Exams -> Chọn bài thi cũ -> Xem chi tiết lời giải & phân tích.
3. **Quản trị (Admin)**: Login (Role Admin) -> Admin Dashboard -> CRUD bài thi/câu hỏi.

---

## 2. Repo Map (Where to change what)
Cấu trúc Source Code (`src/`):

### UI Routes (`src/app/`)
- `(student)/`: Giao diện chính cho học sinh.
  - `exam/[id]/take`: Giao diện làm bài thi (quan trọng).
  - `exam/[id]/result`: Trang kết quả & AI Analysis.
- `(admin)/admin`: Giao diện quản trị.
- `api/`: Backend API routes (Next.js internals).
- `login/`: Trang đăng nhập.

### Key Components & Logic
- `src/components/`:
  - `providers/`: Context providers (Session, Theme, Toast).
  - `ui/`: Các component cơ bản (Button, Input...) thường dùng shadcn/ui.
- `src/lib/`:
  - `prisma.ts`: Khởi tạo Database client (Singleton pattern).
  - `word-parser.ts`: Xử lý file đề thi (nếu có tính năng upload).
  - `utils.ts`: Các hàm tiện ích chung.
- `src/auth.config.ts` & `src/auth.ts`: Cấu hình NextAuth (Callbacks, Providers).

### Database
- `prisma/schema.prisma`: Định nghĩa Data Model (User, Exam, Question, Result...).
- `prisma/migrations/`: Lịch sử thay đổi DB.

---

## 3. Environment Variables
Không có file `.env.example`. Dưới đây là các biến bắt buộc (suy luận từ Code & Dependencies).
**Tuyệt đối không hardcode giá trị thực vào code.**


| Key | Purpose | Example / Notes | Required | Where used |
| :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Connection string tới PostgreSQL | `postgresql://...` | **Yes** | `prisma/schema.prisma` |
| `DIRECT_URL` | Connection string trực tiếp (cho migration) | `postgresql://...` | **Yes** | `prisma/schema.prisma` |
| `AUTH_SECRET` (hoặc `NEXTAUTH_SECRET`) | Dùng cho NextAuth (mã hóa session) | Random string | **Yes** | `src/auth.ts`, `node_modules` (internals) |
| `NEXTAUTH_URL` | URL gốc của ứng dụng | `http://localhost:3000` | **Yes** | NextAuth internal usage |
| `GOOGLE_CLIENT_ID` | Google OAuth Login | Client ID | **Optional** | *Hiện chưa thấy code dùng (chỉ có Credentials Provider trong `src/auth.ts`)* |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | Client Secret | **Optional** | *Hiện chưa thấy code dùng* |
| `GEMINI_API_KEY` (hoặc `GOOGLE_API_KEY`) | Key gọi AI phân tích/list models | AI Studio Key | **Optional** | `scripts/list-models.ts` (có thể cần cho tính năng AI sắp tới) |

---

## 4. Commands
Dự án sử dụng **npm**.

| Command | Description |
| :--- | :--- |
| `npm install` | Cài đặt dependencies. |
| `npm run dev` | Chạy môi trường phát triển (localhost:3000). |
| `npm run build` | Build production (Next.js build). |
| `npm start` | Chạy server production sau khi build. |
| `npm run lint` | Kiểm tra lỗi cú pháp và code style (ESLint). |
| `npm run postinstall` | Tự động chạy `prisma generate` sau khi install. |
| `npx prisma generate` | Tạo Prisma Client mới nhất từ schema. |
| `npx prisma db push` | Đẩy schema lên DB (dùng cho dev/prototyping). |
| `npx prisma studio` | Mở giao diện GUI quản lý Database. |

---

## 5. Verification / QA
Dự án hiện **CHƯA CÓ** lệnh test tự động (`npm test`). Hãy verify thủ công theo checklist:

**Manual QA Checklist:**
1. **Authentication**: Đăng nhập được bằng Google/Credentials. Session được lưu đúng.
2. **Data Consistency**: Tạo thử User/Exam trong Prisma Studio xem có lỗi schema không.
3. **Render Toán học**: Vào trang bài thi, kiểm tra các công thức LaTeX (MathJax/Katex) hiển thị đúng, không bị lỗi font/layout.
4. **Exam Flow**: Thử làm 1 bài thi -> Nộp bài -> Đảm bảo kết quả được lưu vào DB.
5. **AI Feature**: (Nếu có key) Kiểm tra xem AI có trả về text phân tích trong trang kết quả không.
6. **Build Test**: Luôn chạy `npm run build` trước khi finish task để đảm bảo không lỗi Type/Lint.

---

## 6. Deployment Notes
- **Platform**: Tương thích tốt với Vercel, Railway hoặc bất kỳ Node.js host nào.
- **Config**: Không có file config deploy đặc thù (vercel.json, Dockerfile) tại root.
- **Lưu ý**: Cần set đầy đủ Environment Variables trên Dashboard của cloud provider.

---

## 7. Guardrails for Codex (Quy tắc làm việc)
1. **Stack Integrity**:
   - Sử dụng **npm**. Không đổi sang yarn/pnpm/bun.
   - Không tự ý thay đổi `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`.
2. **Database Management**:
   - Bất cứ thay đổi nào trong `schema.prisma` phải đi kèm lệnh `npx prisma generate`.
   - Nếu thay đổi cấu trúc DB, hãy hỏi ý kiến user trước khi chạy migration (`migrate dev` vs `db push`).
   - Tuyệt đối không xóa dữ liệu production.
3. **Security**:
   - **KHÔNG BAO GIỜ** commit file `.env` hoặc hardcode API Key/Secret trong code.
   - Luôn sử dụng biến môi trường `process.env`.
4. **Code Quality**:
   - Giữ code sạch, tuân thủ ESLint.
   - Ưu tiên sửa đổi nhỏ, cục bộ. Tránh refactor diện rộng nếu không cần thiết.
   - Luôn chạy `npm run build` để kiểm tra Type Safety (TypeScript) trước khi báo cáo hoàn thành.
