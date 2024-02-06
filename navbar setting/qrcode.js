function generateQRCode() {
    const inputText = document.getElementById("input_text").value;
    const qrCode = new QRCode(document.getElementById("qrCode"), {
      text: inputText,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  
    // Create a download link for the QR code image
    const qrCodeImage = document.getElementById("qrCode").querySelector("img");
    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeImage.src;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
   
  