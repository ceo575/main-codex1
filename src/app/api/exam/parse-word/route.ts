import { NextRequest, NextResponse } from 'next/server'
import { parseDocxFile } from '@/lib/docx-parser'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
    try {
        // Check authentication
        const session = await auth()
        if (!session || (session.user as any)?.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get file from form data
        const formData = await req.formData()
        const file = formData.get('file') as File

        console.log('API: Received file:', file ? { name: file.name, size: file.size, type: file.type } : 'null')

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Check file type
        if (!file.name.endsWith('.docx')) {
            return NextResponse.json(
                { error: 'File must be .docx format' },
                { status: 400 }
            )
        }

        // Parse the Word file - parser now returns standardized format
        const questions = await parseDocxFile(file)

        console.log(`API: Successfully parsed ${questions.length} questions.`);

        return NextResponse.json({
            success: true,
            questions,
            count: questions.length
        })

    } catch (error: any) {
        console.error('API Error parsing Word file:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to parse Word file' },
            { status: 500 }
        )
    }
}
