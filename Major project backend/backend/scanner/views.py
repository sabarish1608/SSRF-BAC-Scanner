from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import validators
from urllib.parse import urlparse

class ScanURLView(APIView):
    def get(self, request):
        return Response({"message": "Backend is working fine"}, status=status.HTTP_200_OK)

    def post(self, request):
        url = request.data.get("url")

        # Validate URL
        if not url or not validators.url(url):
            return Response({"error": "Valid URL is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Debugging: Print received URL
        print(f"Received URL: {url}")

        # Scan for SSRF and BAC
        ssrf_risk = self.check_ssrf(url)
        bac_risk = self.check_bac(url)

        return Response({
            "url": url,
            "ssrf_risk": ssrf_risk,
            "bac_risk": bac_risk
        }, status=status.HTTP_200_OK)

    def check_ssrf(self, url):
        """Check for SSRF vulnerabilities"""
        try:
            parsed_url = urlparse(url)
            if parsed_url.hostname in ["169.254.169.254", "metadata.google.internal"]:
                return 90  # High risk

            response = requests.get(url, timeout=3)

            if "metadata.google.internal" in response.text or "169.254.169.254" in response.text:
                return 90  # High risk
            return 20  # Low risk
        except requests.exceptions.RequestException:
            return 50  # Medium risk (Cannot determine)

    def check_bac(self, url):
        """Check for Broken Access Control vulnerabilities"""
        sensitive_endpoints = ["/admin", "/config", "/private", "/secret"]
        for endpoint in sensitive_endpoints:
            full_url = f"{url.rstrip('/')}/{endpoint}"  # Ensure proper formatting
            try:
                response = requests.get(full_url, timeout=3)
                if response.status_code == 200:
                    return 80  # High risk
                elif response.status_code == 403:
                    return 30  # Low risk
            except requests.exceptions.RequestException:
                continue
        return 50  # Medium risk
