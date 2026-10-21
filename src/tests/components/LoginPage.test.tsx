// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import LoginPage from "@/src/app/(auth)/login/page";