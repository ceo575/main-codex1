"use client"

import { Question, useExamStore } from "@/stores/exam-store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Link as LinkIcon } from "lucide-react"

interface EditPanelProps {
    question: Question | null
}

const MOCK_CHAPTERS = [
    "Chương 1: Hàm số",
    "Chương 2: Mũ và Logarit",
    "Chương 3: Nguyên hàm - Tích phân",
    "Chương 4: Số phức",
    "Chương 5: Khối đa diện",
    "Chương 6: Khối tròn xoay",
    "Chương 7: Oxyz"
]

const MOCK_LESSONS = [
    "Bài 1: Sự đồng biến nghịch biến",
    "Bài 2: Cực trị của hàm số",
    "Bài 3: GTLN - GTNN",
    "Bài 4: Đường tiệm cận",
    "Bài 5: Khảo sát hàm số",
    "Bài 6: Lũy thừa",
    "Bài 7: Logarit"
]

const MOCK_PROBLEM_TYPES = [
    "Nhận biết đồ thị",
    "Tìm tham số m",
    "Tính đơn điệu",
    "Bài toán thực tế",
    "Phương trình mũ",
    "Tính tích phân",
    "Thể tích khối lăng trụ"
]

export function EditPanel({ question }: EditPanelProps) {
    const { updateQuestion } = useExamStore()

    if (!question) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                <p>Chọn một câu hỏi để chỉnh sửa</p>
            </div>
        )
    }

    const handleContentChange = (value: string) => {
        updateQuestion(question.id, { content: value })
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(question.options || [])]
        newOptions[index] = value
        updateQuestion(question.id, { options: newOptions })
    }

    const handleCorrectAnswerChange = (value: string) => {
        updateQuestion(question.id, { correctOptionIndex: undefined })
        // Note: For TF, we handle differently in UI but store in correctAnswer
        updateQuestion(question.id, { correctAnswer: value })
    }

    const handleExplanationChange = (value: string) => {
        updateQuestion(question.id, { explanation: value })
    }

    const handleVideoUrlChange = (value: string) => {
        updateQuestion(question.id, { videoUrl: value })
    }

    const handleChapterChange = (value: string) => {
        updateQuestion(question.id, { chapter: value })
    }

    const handleLessonChange = (value: string) => {
        updateQuestion(question.id, { lesson: value })
    }

    const handleProblemTypeChange = (value: string) => {
        updateQuestion(question.id, { problemType: value })
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-20 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                {/* Question Content */}
                <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-medium">
                        Nội dung câu hỏi <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="content"
                        value={question.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        placeholder="Nhập nội dung câu hỏi (hỗ trợ LaTeX với $...$)"
                        className="min-h-[120px] resize-y"
                    />
                    <p className="text-xs text-slate-500">
                        Sử dụng $...$ cho công thức LaTeX inline, $$...$$ cho công thức block
                    </p>
                </div>

                {/* MCQ Options */}
                {question.type === 'MCQ' && (
                    <div className="space-y-4">
                        <Label className="text-sm font-medium">Các lựa chọn</Label>
                        {question.options?.map((option, index) => {
                            const label = String.fromCharCode(65 + index) // A, B, C, D
                            return (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={question.correctAnswer === label}
                                            onChange={() => handleCorrectAnswerChange(label)}
                                            className="w-4 h-4 text-emerald-600 cursor-pointer"
                                        />
                                        <span className="font-bold text-sm w-4">{label}.</span>
                                    </div>
                                    <Textarea
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Lựa chọn ${label}`}
                                        className="flex-1 min-h-[60px]"
                                        rows={2}
                                    />
                                </div>
                            )
                        })}
                        <p className="text-xs text-slate-500">
                            Chọn radio button bên trái để đánh dấu đáp án đúng
                        </p>
                    </div>
                )}

                {/* True/False Question Editor */}
                {question.type === 'TRUE_FALSE' && (
                    <div className="space-y-4">
                        <Label className="text-sm font-medium">Các mệnh đề (Đúng/Sai)</Label>
                        <div className="border rounded-lg overflow-hidden border-slate-200">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Mệnh đề</th>
                                        <th className="px-3 py-2 text-center w-16 font-semibold text-slate-600">Đúng</th>
                                        <th className="px-3 py-2 text-center w-16 font-semibold text-slate-600">Sai</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 italic text-slate-500">
                                    <tr className="bg-slate-50/50">
                                        <td colSpan={3} className="px-3 py-2 text-[10px] text-center">
                                            (Chỉnh sửa nội dung các mệnh đề bên dưới)
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {question.options?.map((option, index) => {
                            const label = String.fromCharCode(97 + index) // a, b, c, d
                            const currentAnswers = (question.correctAnswer || "").split(",")
                            const currentVal = currentAnswers[index] || "S" // Default to 'S' (False)

                            const toggleAnswer = (val: string) => {
                                const newAnswers = [...currentAnswers]
                                while (newAnswers.length <= index) newAnswers.push("S")
                                newAnswers[index] = val
                                handleCorrectAnswerChange(newAnswers.join(","))
                            }

                            return (
                                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex flex-col gap-3 pt-2">
                                        <span className="font-bold text-sm text-blue-600 w-6 uppercase">{label})</span>
                                        <div className="flex flex-col gap-4 items-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name={`tf_${question.id}_${index}`}
                                                    checked={currentVal === "Đ"}
                                                    onChange={() => toggleAnswer("Đ")}
                                                    className="w-4 h-4 text-emerald-600 cursor-pointer"
                                                />
                                                <span className="text-[10px] font-medium text-emerald-600">Đ</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                <input
                                                    type="radio"
                                                    name={`tf_${question.id}_${index}`}
                                                    checked={currentVal === "S"}
                                                    onChange={() => toggleAnswer("S")}
                                                    className="w-4 h-4 text-red-600 cursor-pointer"
                                                />
                                                <span className="text-[10px] font-medium text-red-600">S</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Textarea
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Mệnh đề ${label}`}
                                        className="flex-1 bg-white min-h-[80px]"
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Short Answer */}
                {question.type === 'SHORT_ANSWER' && (
                    <div className="space-y-2">
                        <Label htmlFor="correctAnswer" className="text-sm font-medium">
                            Đáp án đúng <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="correctAnswer"
                            value={question.correctAnswer || ''}
                            onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                            placeholder="Nhập đáp án"
                        />
                    </div>
                )}

                {/* Explanation */}
                <div className="space-y-2">
                    <Label htmlFor="explanation" className="text-sm font-medium">
                        Lời giải
                        <span className="text-slate-400 font-normal ml-1">- Tùy chọn</span>
                    </Label>
                    <Textarea
                        id="explanation"
                        value={question.explanation || ''}
                        onChange={(e) => handleExplanationChange(e.target.value)}
                        placeholder="Nhập lời giải chi tiết (hỗ trợ LaTeX)"
                        className="min-h-[120px]"
                    />
                </div>

                {/* Video URL */}
                <div className="space-y-2">
                    <Label htmlFor="videoUrl" className="text-sm font-medium">
                        Link video giải
                        <span className="text-slate-400 font-normal ml-1">- Tùy chọn</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="videoUrl"
                            type="url"
                            value={question.videoUrl || ''}
                            onChange={(e) => handleVideoUrlChange(e.target.value)}
                            placeholder="https://youtube.com/... hoặc https://drive.google.com/..."
                            className="pl-10"
                        />
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500">
                        Link video giải riêng cho câu hỏi này (YouTube, Google Drive, v.v.)
                    </p>
                </div>

                {/* Classification Section */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700">Phân loại câu hỏi</h4>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Level */}
                        <div className="space-y-2">
                            <Label htmlFor="level" className="text-sm font-medium">
                                Mức độ
                            </Label>
                            <select
                                id="level"
                                value={question.level || ''}
                                onChange={(e) => updateQuestion(question.id, { level: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Chọn mức độ</option>
                                <option value="NB">Nhận biết</option>
                                <option value="TH">Thông hiểu</option>
                                <option value="VD">Vận dụng</option>
                                <option value="VDC">Vận dụng cao</option>
                            </select>
                        </div>

                        {/* Problem Type */}
                        <div className="space-y-2">
                            <Label htmlFor="problemType" className="text-sm font-medium">
                                Dạng toán
                            </Label>
                            <select
                                id="problemType"
                                value={question.problemType || ''}
                                onChange={(e) => handleProblemTypeChange(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            >
                                <option value="">Chọn dạng toán</option>
                                {MOCK_PROBLEM_TYPES.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Chapter & Lesson */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="chapter" className="text-sm font-medium">
                                Chương
                            </Label>
                            <select
                                id="chapter"
                                value={question.chapter || ''}
                                onChange={(e) => handleChapterChange(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            >
                                <option value="">Chọn chương</option>
                                {MOCK_CHAPTERS.map((chap) => (
                                    <option key={chap} value={chap}>{chap}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lesson" className="text-sm font-medium">
                                Bài
                            </Label>
                            <select
                                id="lesson"
                                value={question.lesson || ''}
                                onChange={(e) => handleLessonChange(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            >
                                <option value="">Chọn bài</option>
                                {MOCK_LESSONS.map((lesson) => (
                                    <option key={lesson} value={lesson}>{lesson}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags" className="text-sm font-medium">
                            Tags (Ngăn cách bởi dấu phẩy)
                        </Label>
                        <Input
                            id="tags"
                            value={question.tags?.join(", ") || ''}
                            onChange={(e) => updateQuestion(question.id, { tags: e.target.value.split(",").map(t => t.trim()) })}
                            placeholder="VD: hsg, 2024, de-thi-thu"
                        />
                    </div>
                </div>

                {/* Question Type Badge */}
                <div className="pt-4 border-t border-slate-200 pb-10">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Loại câu hỏi:</span>
                        <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded">
                            {question.type === 'MCQ' ? 'Trắc nghiệm' :
                                question.type === 'SHORT_ANSWER' ? 'Tự luận ngắn' :
                                    'Đúng/Sai'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
