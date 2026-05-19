'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary component that catches React errors and displays a fallback UI
 * Prevents the entire app from crashing when a component throws an error
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('React Error Boundary caught an error', error, {
            componentStack: errorInfo.componentStack,
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <Card className="max-w-lg w-full">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-6 w-6 text-destructive" />
                                <CardTitle>Something went wrong</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                We're sorry, but something unexpected happened. The error has been logged
                                and we'll look into it.
                            </p>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="p-4 bg-muted rounded-md">
                                    <p className="text-sm font-mono text-destructive break-all">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button onClick={this.handleReset}>
                                    Try Again
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = '/'}
                                >
                                    Go Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
