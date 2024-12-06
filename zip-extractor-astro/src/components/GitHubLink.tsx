import * as React from "react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface GitHubLinkProps {
  repo: string;
}

export function GitHubLink({ repo }: GitHubLinkProps) {
  return (
    <Button
      asChild
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      size="icon"
    >
      <a>
        <Github className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">GitHub Repository</span>
      </a>
    </Button>
  );
}
