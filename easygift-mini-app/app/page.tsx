"use client";

import { useState, useEffect } from "react";

type Tab = "home" | "create" | "history" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [cashback, setCashback] = useState(0);
  const [cards, setCards] = useState<Array<{ id: number; title: string; amount: number; date: string }>>([]);
  const [cardTitle, setCardTitle] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUserName(tg.initDataUnsafe.user.first_name || "Гость");
      }
    }
    // Load demo data
    setCashback(1250);
    setCards([
      { id: 1, title: "С Днём Рождения!", amount: 500, date: "25 дек 2024" },
      { id: 2, title: "С Новым Годом!", amount: 1000, date: "1 янв 2025" },
    ]);
  }, []);

  const createCard = () => {
    if (!cardTitle || !cardAmount) return;
    const newCard = {
      id: Date.now(),
      title: cardTitle,
      amount: parseInt(cardAmount),
      date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" }),
    };
    setCards([newCard, ...cards]);
    setCashback((c) => c + Math.floor(newCard.amount * 0.1));
    setCardTitle("");
    setCardAmount("");
    setActiveTab("history");
  };

  return (
    <div className="container">
      <div className="header">
        <h1>EasyGift</h1>
        <p style={{ color: "#94a3b8", marginTop: 4 }}>Привет, {userName}!</p>
      </div>

      {activeTab === "home" && (
        <>
          <div className="card cashback-card">
            <p style={{ textAlign: "center", color: "#94a3b8" }}>Ваш кэшбэк</p>
            <div className="cashback-amount">{cashback.toLocaleString("ru-RU")}</div>
            <p style={{ textAlign: "center", color: "#64748b", fontSize: 14 }}>
              Вы получили 10% с каждой открытки
            </p>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Последние открытки</h3>
            {cards.slice(0, 3).map((card) => (
              <div key={card.id} className="history-item">
                <div>
                  <div style={{ fontWeight: 600 }}>{card.title}</div>
                  <div style={{ color: "#64748b", fontSize: 14 }}>{card.date}</div>
                </div>
                <div style={{ color: "#10b981", fontWeight: 600 }}>+{card.amount}</div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => setActiveTab("create")}>
            Создать открытку
          </button>
        </>
      )}

      {activeTab === "create" && (
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Новая открытка</h3>
          <label className="label">Название</label>
          <input
            className="input"
            placeholder="С Днём Рождения!"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
          />
          <label className="label">Сумма подарка (₽)</label>
          <input
            className="input"
            type="number"
            placeholder="1000"
            value={cardAmount}
            onChange={(e) => setCardAmount(e.target.value)}
          />
          <button className="btn btn-success" onClick={createCard}>
            Отправить открытку
          </button>
        </div>
      )}

      {activeTab === "history" && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>История открыток</h3>
          {cards.map((card) => (
            <div key={card.id} className="history-item">
              <div>
                <div style={{ fontWeight: 600 }}>{card.title}</div>
                <div style={{ color: "#64748b", fontSize: 14 }}>{card.date}</div>
              </div>
              <div style={{ color: "#10b981", fontWeight: 600 }}>+{card.amount}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "profile" && (
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Профиль</h3>
          <div className="history-item">
            <span style={{ color: "#94a3b8" }}>Имя</span>
            <span>{userName}</span>
          </div>
          <div className="history-item">
            <span style={{ color: "#94a3b8" />}Кэшбэк</span>
            <span>{cashback.toLocaleString("ru-RU")}</span>
          </div>
          <div className="history-item">
            <span style={{ color: "#94a3b8" />}Открыток отправлено</span>
            <span>{cards.length}</span>
          </div>
        </div>
      )}

      <div className="bottom-spacer" />

      <div className="tab-bar">
        <button className={`tab ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
          <span className="tab-icon">🏠</span>
          Главная
        </button>
        <button className={`tab ${activeTab === "create" ? "active" : ""}`} onClick={() => setActiveTab("create")}>
          <span className="tab-icon">✨</span>
          Создать
        </button>
        <button className={`tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
          <span className="tab-icon">📋</span>
          История
        </button>
        <button className={`tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
          <span className="tab-icon">👤</span>
          Профиль
        </button>
      </div>
    </div>
  );
}
