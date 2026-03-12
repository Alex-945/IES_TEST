import random
import tkinter as tk
from tkinter import messagebox


class WhackAMoleGame:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("打地鼠 Whack-a-Mole")
        self.root.resizable(False, False)

        # 遊戲狀態
        self.score = 0
        self.time_left = 30
        self.current_mole = -1
        self.game_running = False

        # 介面區
        top_frame = tk.Frame(root, padx=10, pady=10)
        top_frame.pack(fill="x")

        self.score_label = tk.Label(top_frame, text="分數：0", font=("Arial", 14, "bold"))
        self.score_label.pack(side="left")

        self.time_label = tk.Label(top_frame, text="剩餘時間：30 秒", font=("Arial", 14, "bold"))
        self.time_label.pack(side="right")

        self.status_label = tk.Label(
            root,
            text="按下開始遊戲，看到地鼠就點它！",
            font=("Arial", 12),
            fg="#333",
            pady=6,
        )
        self.status_label.pack()

        board = tk.Frame(root, padx=10, pady=10)
        board.pack()

        # 3x3 洞穴
        self.holes: list[tk.Button] = []
        for i in range(9):
            btn = tk.Button(
                board,
                text="🕳️",
                width=7,
                height=3,
                font=("Arial", 16),
                command=lambda idx=i: self.hit(idx),
                bg="#f5f5f5",
                activebackground="#e8e8e8",
                relief="raised",
            )
            btn.grid(row=i // 3, column=i % 3, padx=4, pady=4)
            self.holes.append(btn)

        bottom = tk.Frame(root, padx=10, pady=10)
        bottom.pack(fill="x")

        self.start_button = tk.Button(
            bottom,
            text="開始遊戲",
            font=("Arial", 12, "bold"),
            command=self.start_game,
            bg="#4CAF50",
            fg="white",
            activebackground="#43a047",
            padx=12,
            pady=4,
        )
        self.start_button.pack(side="left")

        self.quit_button = tk.Button(
            bottom,
            text="離開",
            font=("Arial", 12),
            command=root.destroy,
            padx=12,
            pady=4,
        )
        self.quit_button.pack(side="right")

    def start_game(self) -> None:
        self.score = 0
        self.time_left = 30
        self.current_mole = -1
        self.game_running = True
        self.start_button.config(state="disabled")
        self.status_label.config(text="快打地鼠！")
        self.update_score()
        self.update_time()
        self.spawn_mole()
        self.tick()

    def update_score(self) -> None:
        self.score_label.config(text=f"分數：{self.score}")

    def update_time(self) -> None:
        self.time_label.config(text=f"剩餘時間：{self.time_left} 秒")

    def clear_moles(self) -> None:
        for btn in self.holes:
            btn.config(text="🕳️", bg="#f5f5f5")

    def spawn_mole(self) -> None:
        if not self.game_running:
            return

        self.clear_moles()
        self.current_mole = random.randint(0, 8)
        mole_button = self.holes[self.current_mole]
        mole_button.config(text="🐹", bg="#ffe082")

        # 每 700ms 移動一次地鼠
        self.root.after(700, self.spawn_mole)

    def hit(self, idx: int) -> None:
        if not self.game_running:
            return

        if idx == self.current_mole:
            self.score += 1
            self.status_label.config(text="命中！")
            self.update_score()
            # 立刻換位置，提升節奏感
            self.spawn_mole()
        else:
            self.status_label.config(text="打空了，加油！")

    def tick(self) -> None:
        if not self.game_running:
            return

        self.time_left -= 1
        self.update_time()

        if self.time_left <= 0:
            self.end_game()
            return

        self.root.after(1000, self.tick)

    def end_game(self) -> None:
        self.game_running = False
        self.clear_moles()
        self.current_mole = -1
        self.start_button.config(state="normal")
        self.status_label.config(text="時間到！")

        messagebox.showinfo("遊戲結束", f"最終分數：{self.score}")


def main() -> None:
    root = tk.Tk()
    WhackAMoleGame(root)
    root.mainloop()


if __name__ == "__main__":
    main()
