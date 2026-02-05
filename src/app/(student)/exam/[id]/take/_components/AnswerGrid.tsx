"use client"

import { useState } from "react"
import { Question } from "../mockData"
import { cn } from "@/lib/utils"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter, useParams } from "next/navigation"

interface AnswerGridProps {
    questions: Question[]
    answers: Record<string, any>
    onNavigate: (id: number) => void
}

export function AnswerGrid({ questions, answers, onNavigate }: AnswerGridProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const params = useParams()
    const id = params.id

    const handleSubmit = async () => {
        setIsSubmitting(true)
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsSubmitting(false)
        toast.success("Nộp bài thành công! Đang chuyển hướng đến kết quả...")
        router.push(`/exam/${id}/result`)
    }

    return (
        <div className="bg-white h-full flex flex-col">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#059669]">
                        <span className="material-symbols-outlined text-2xl font-bold">school</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900 text-sm mb-1">Đề thi thử Tốt nghiệp THPT 2024</h2>
                        <div className="text-xs text-slate-500">Môn Toán - Mã đề 101</div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full border border-slate-300"></span> 90 phút
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center justify-end gap-3 text-[10px] text-slate-400 mb-4 uppercase font-bold tracking-wider">
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#059669]"></span> Đã làm</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-[#059669]"></span> Đang xem</div>
                    <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-200"></span> Chưa làm</div>
                </div>

                <h3 className="text-xs font-bold text-slate-800 uppercase mb-3">Phiếu trả lời</h3>
                <div className="grid grid-cols-5 gap-2">
                    {questions.map((q) => {
                        // Check if answered
                        const isAnswered = answers[q.id] !== undefined && answers[q.id] !== "";
                        // For T/F, check if any prop is answered? Or all? Let's assume partial is "answered" for visual feedback
                        const isTFAnswered = q.type === 'true_false' && answers[q.id] && Object.keys(answers[q.id]).length > 0;

                        const hasData = isAnswered || isTFAnswered;

                        return (
                            <button
                                key={q.id}
                                onClick={() => onNavigate(q.id)}
                                className={cn(
                                    "aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all",
                                    hasData
                                        ? "bg-[#059669] text-white shadow-sm shadow-emerald-200 ring-1 ring-emerald-600"
                                        : "bg-white border border-slate-200 text-slate-500 hover:border-[#059669] hover:text-[#059669]"
                                )}
                            >
                                {q.id}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full border-slate-300 text-slate-600 hover:bg-white hover:text-slate-900 font-bold"
                >
                    Rời khỏi
                </Button>
                <Button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full bg-[#059669] hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang nộp...
                        </>
                    ) : (
                        "Nộp bài"
                    )}
                </Button>
                <div className="text-[10px] text-center text-slate-400">Vui lòng kiểm tra kỹ bài làm trước khi nộp</div>
            </div>
        </div>
    )
}
