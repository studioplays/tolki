body {
  font-family: sans-serif;
  background: #f1f1f1;
  padding: 2rem;
  color: #333;
}
.container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  margin: auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.lang-select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
textarea {
  width: 100%;
  height: 80px;
  resize: none;
  padding: 0.5rem;
}
.output {
  margin-top: 1.5rem;
  background: #eef;
  padding: 1rem;
  border-radius: 8px;
}
button {
  padding: 0.5rem 1rem;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background: #aaa;
  cursor: not-allowed;
}
