import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

export default function JoinCodeRedirect() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  if (!code) return <Redirect href="/join" />;
  return <Redirect href={`/join?code=${encodeURIComponent(String(code))}` as never} />;
}
