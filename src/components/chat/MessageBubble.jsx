import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { Copy, Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MessageBubble({ message }) {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';
    
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Texto copiado!');
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div className={cn("flex gap-3 max-w-[85%]", isUser ? "ml-auto" : "mr-auto")}>
            {!isUser && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-md">
                    T
                </div>
            )}
            <div className={cn(
                "rounded-2xl px-4 py-3 shadow-md",
                isUser 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white" 
                    : "bg-white border border-slate-200"
            )}>
                {isUser ? (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                ) : (
                    <div className="relative group">
                        <ReactMarkdown 
                            className="text-sm prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                            components={{
                                code: ({ inline, className, children, ...props }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeString = String(children).replace(/\n$/, '');
                                    
                                    return !inline && match ? (
                                        <div className="relative group/code my-2">
                                            <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-xs">
                                                <code className={className} {...props}>{children}</code>
                                            </pre>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover/code:opacity-100 bg-slate-800 hover:bg-slate-700 transition-opacity"
                                                onClick={() => handleCopy(codeString)}
                                            >
                                                {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
                                            </Button>
                                        </div>
                                    ) : (
                                        <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono border border-slate-200">
                                            {children}
                                        </code>
                                    );
                                },
                                a: ({ children, ...props }) => (
                                    <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                                        {children}
                                    </a>
                                ),
                                p: ({ children }) => <p className="my-2 leading-relaxed">{children}</p>,
                                ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                h1: ({ children }) => <h1 className="text-lg font-bold my-3">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-bold my-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-bold my-2">{children}</h3>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-blue-500 pl-4 my-2 italic text-slate-600">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 bg-white border border-slate-200 hover:bg-slate-50 transition-opacity"
                            onClick={() => handleCopy(message.content)}
                        >
                            {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-slate-600" />}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}