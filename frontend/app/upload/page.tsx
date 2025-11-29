import { UploadDropzone } from "@/components/UploadDropzone"

export default function UploadPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-white">Upload Documents</h1>
                    <p className="text-white/60">Let's start by analyzing your current financial situation</p>
                </div>

                <UploadDropzone />
            </div>
        </div>
    )
}
