"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User,
  DollarSign,
  Info,
  Wrench,
  Zap,
  Building2,
  Scale,
  ChartBarBig,
  CircleHelp,
  FileText,
} from "lucide-react";

interface ThinkingContent {
  id: string;
  content: string;
  user_mood?: string;
  matched_categories?: string[];
  debug?: {
    context_used: boolean;
    context?: string;
    rag_sources?: Array<{
      id: string;
      fileName: string;
      snippet: string;
      score: number;
    }>;
  };
}

const getDebugPillColor = (value: boolean): string => {
  return value
    ? "bg-green-100 text-green-800 border-green-300" // Success
    : "bg-yellow-100 text-yellow-800 border-yellow-300"; // Not Used/Not Relevant
};

const getMoodColor = (mood: string): string => {
  const colors: { [key: string]: string } = {
    positive: "bg-green-100 text-green-800",
    negative: "bg-red-100 text-red-800",
    curious: "bg-blue-100 text-blue-800",
    frustrated: "bg-orange-100 text-orange-800",
    confused: "bg-yellow-100 text-yellow-800",
    neutral: "bg-gray-100 text-gray-800",
  };
  return colors[mood?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

const MAX_THINKING_HISTORY = 15;

const LeftSidebar: React.FC = () => {
  const [thinkingContents, setThinkingContents] = useState<ThinkingContent[]>(
    [],
  );
  const [showContextModal, setShowContextModal] = useState(false);
  const [selectedContext, setSelectedContext] = useState<{
    context: string;
    sources: Array<{
      id: string;
      fileName: string;
      snippet: string;
      score: number;
    }>;
  } | null>(null);

  useEffect(() => {
    const handleUpdateSidebar = (event: CustomEvent<ThinkingContent>) => {
      if (event.detail && event.detail.id) {
        console.log("🔍 DEBUG: Sidebar Event:", event.detail);
        setThinkingContents((prev) => {
          const exists = prev.some((item) => item.id === event.detail.id);
          if (!exists) {
            console.log(
              "📝 New thinking entry: ",
              event.detail.content.slice(0, 50) + "...",
            ); // Shows first 50 chars

            // Add a timestamp!
            const enhancedEntry = {
              ...event.detail,
              timestamp: new Date().toISOString(),
            };

            const newHistory = [enhancedEntry, ...prev].slice(
              0,
              MAX_THINKING_HISTORY,
            ); // Always keep latest 20

            return newHistory;
          }
          return prev;
        });
      } else {
        console.warn("Missing 'id' in sidebar event detail:", event.detail);
      }
    };

    window.addEventListener(
      "updateSidebar",
      handleUpdateSidebar as EventListener,
    );
    return () =>
      window.removeEventListener(
        "updateSidebar",
        handleUpdateSidebar as EventListener,
      );
  }, []);

  return (
    <aside className="w-[380px] pl-4 overflow-hidden pb-4">
      <Card className="h-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-sm font-medium leading-none">
            Assistant Thinking
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto h-[calc(100%-45px)]">
          {thinkingContents.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              The assistant inner dialogue will appear here for you to debug it
            </div>
          ) : (
            thinkingContents.map((content) => (
              <Card
                key={content.id}
                className="mb-4 animate-fade-in-up"
                style={{
                  animationDuration: "600ms",
                  animationFillMode: "backwards",
                  animationTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)", // This adds bounce
                }}
              >
                <CardContent className="py-4">
                  <div className="text-sm text-muted-foreground">
                    {content.content}
                  </div>
                  {content.user_mood && content.debug && (
                    <div className="flex items-center space-x-2 mt-4 text-xs">
                      {/* Mood */}
                      <span
                        className={`px-2 py-1 rounded-full ${getMoodColor(content.user_mood)}`}
                      >
                        {content.user_mood.charAt(0).toUpperCase() +
                          content.user_mood.slice(1)}
                      </span>

                      <button
                        onClick={() => {
                          if (content.debug?.context && content.debug?.context_used) {
                            setSelectedContext({
                              context: content.debug.context,
                              sources: content.debug.rag_sources || []
                            });
                            setShowContextModal(true);
                          }
                        }}
                        className={`px-2 py-1 rounded-full ${getDebugPillColor(content.debug.context_used)} ${
                          content.debug?.context_used && content.debug?.context 
                            ? "cursor-pointer hover:opacity-80 transition-opacity" 
                            : "cursor-default"
                        }`}
                        disabled={!content.debug?.context_used || !content.debug?.context}
                      >
                        Context: {content.debug.context_used ? "✅" : "❌"}
                      </button>
                    </div>
                  )}
                  {content.matched_categories &&
                    content.matched_categories.length > 0 && (
                      <div className="mt-2">
                        {content.matched_categories.map((category) => (
                          <div
                            key={category}
                            className="inline-flex items-center mr-2 mt-2 text-muted-foreground text-xs py-0"
                          >
                            {category === "account" && (
                              <User className="w-3 h-3 mr-1" />
                            )}
                            {category === "billing" && (
                              <DollarSign className="w-3 h-3 mr-1" />
                            )}
                            {category === "feature" && (
                              <Zap className="w-3 h-3 mr-1" />
                            )}
                            {category === "internal" && (
                              <Building2 className="w-3 h-3 mr-1" />
                            )}
                            {category === "legal" && (
                              <Scale className="w-3 h-3 mr-1" />
                            )}
                            {category === "other" && (
                              <CircleHelp className="w-3 h-3 mr-1" />
                            )}
                            {category === "technical" && (
                              <Wrench className="w-3 h-3 mr-1" />
                            )}
                            {category === "usage" && (
                              <ChartBarBig className="w-3 h-3 mr-1" />
                            )}
                            {category
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </div>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
      
      {/* Context Modal */}
      <Dialog open={showContextModal} onOpenChange={setShowContextModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              RAG Context Used
            </DialogTitle>
            <DialogDescription>
              This is the context that was retrieved and provided to the AI model.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4">
            {selectedContext && (
              <>
                {/* RAG Sources */}
                {selectedContext.sources.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Retrieved Sources:</h3>
                    <div className="space-y-2">
                      {selectedContext.sources.map((source) => (
                        <Card key={source.id} className="p-3">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-medium">{source.fileName}</h4>
                            <span className="text-xs text-muted-foreground">
                              Score: {source.score.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{source.snippet}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Full Context */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Full Context:</h3>
                  <Card className="p-4">
                    <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
                      {selectedContext.context}
                    </pre>
                  </Card>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

export default LeftSidebar;
