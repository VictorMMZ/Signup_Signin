/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author victor
 */

public class Movement {

    private int id;
    private String timestamp;
    private double amount;
    private double balance;
    private String description;

    // --- Constructor vacío obligatorio para Jackson ---
    public Movement() {
    }

    // --- Constructor con todos los atributos ---
    public Movement(int id, String timestamp, double amount, double balance, String description) {
        this.id = id;
        this.timestamp = timestamp;
        this.amount = amount;
        this.balance = balance;
        this.description = description;
    }

    // --- Getters y Setters ---
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
